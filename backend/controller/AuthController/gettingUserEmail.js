import userModel from "../../models/User.js";

export const getUserEmail = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('email verifyEmail profileCreated');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      email: user.email,
      verifyEmail: user.verifyEmail,
      profileCreated: user.profileCreated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};