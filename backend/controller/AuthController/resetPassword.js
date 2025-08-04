import userModel from "../../models/User.js";
import bcrypt from 'bcryptjs';

export const resetPassword = async (req, res) => {
    
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).json({ message: 'Email and new password are required' });

  if (newPassword.length < 6)
    return res.status(400).json({ message: 'Password should be at least 6 characters' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optionally verify OTP again here for security (or ensure this route is protected)

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordOtp = 0;
    user.expiresResetOtp = null;
    await user.save();

    return res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}