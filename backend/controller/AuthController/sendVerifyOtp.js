import userModel from '../../models/User.js';
import transporter from "../../config/nidemailer.js";
import { senderEmail } from "../../config/config.js";
export const sendVerifyOtp = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { email } = req.body;
    if (email !== user.email) {
      return res.status(400).json({ message: 'Entered email does not match your login email.' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set OTP and expiry (e.g., 10 min)
    user.verifyEmailOtp = otp;
    user.expiresVerifyEmailOtp = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    await user.save();

    const mailOptions = {
      from: senderEmail,
      to: email,
      subject: "Your OTP for Password Reset",
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending OTP.' });
  }
};
