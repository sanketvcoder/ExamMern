import userModel from "../../models/User.js";
import transporter from "../../config/nidemailer.js";
import { senderEmail } from "../../config/config.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Save OTP and expiry in user document
    user.resetPasswordOtp = otp;
    user.expiresResetOtp = expiresAt;
    await user.save();

    const mailOptions = {
      from: senderEmail,
      to: email,
      subject: "Your OTP for Password Reset",
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
