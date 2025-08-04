import userModel from "../../models/User.js";
export const verifyEmailOtp = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { otp } = req.body;
    if (
      !user.verifyEmailOtp ||
      user.verifyEmailOtp.toString() !== otp ||
      !user.expiresVerifyEmailOtp ||
      user.expiresVerifyEmailOtp < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark email verified
    user.verifyEmail = true;
    user.isVerified = true;
    user.verifyEmailOtp = null;
    user.expiresVerifyEmailOtp = null;

    await user.save();

    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error verifying OTP.' });
  }
};