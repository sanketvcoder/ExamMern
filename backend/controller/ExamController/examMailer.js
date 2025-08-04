
import Test from '../../models/examModel.js';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import transporter from "../../config/nidemailer.js";
import { senderEmail } from "../../config/config.js";
export const publishTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const teacherId = req.user?.id;

    // Validate testId and teacher auth
    if (!testId || !mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: 'Invalid test ID.' });
    }

    // Find the test owned by teacher
    const test = await Test.findOne({ _id: testId, teacher: teacherId });
    if (!test) {
      return res.status(404).json({ message: 'Test not found.' });
    }

    // Update test to published
    test.isPublished = true;
    await test.save();

    // Fetch all users to send email (adjust criteria if needed)
    const users = await User.find({}, 'email').lean();

    // Prepare email list
    const recipientEmails = users.map(u => u.email).filter(Boolean);

    // Email content
    const mailOptions = {
      from: senderEmail,
      bcc: recipientEmails,  // Use BCC to avoid exposing emails
      subject: `New Test Published: ${test.name}`,
      html: `
        <h3>New Test Published!</h3>
        <p>The test <strong>${test.name}</strong> has been published and is now available to attempt.</p>
        <p>Scheduled Time: ${test.scheduledTime ? test.scheduledTime.toLocaleString() : 'Not Scheduled'}</p>
        <p>Duration: ${test.durationMinutes || 'N/A'} minutes</p>
        <p>Please login to your account to participate.</p>
        <b>ID</b> : ${test._id}<br />
        <b>Password</b> : ${test.password || 'N/A'}<br />
        <b>Section</b> : ${test.targetSection || 'N/A'}<br />

        <br />
        <p>Best regards,<br/>Your Exam Platform Team</p>
      `
    };
    console.log('Sending test email to the following recipients:', recipientEmails);
    // Send mail asynchronously but await to catch errors
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Test published and notifications sent.', test });

  } catch (error) {
    console.error('Error publishing test:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
