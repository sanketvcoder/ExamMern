import userModel from "../../models/User.js";

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('Stored OTP:', user.resetPasswordOtp);
    console.log('Provided OTP:', otp);
    console.log('Expires at:', user.expiresResetOtp);
    console.log('Now:', new Date());

    if (
      !user.resetPasswordOtp ||
      user.resetPasswordOtp.toString() !== otp.toString() ||
      !user.expiresResetOtp ||
      new Date(user.expiresResetOtp) < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    return res.json({ message: 'OTP verified' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
