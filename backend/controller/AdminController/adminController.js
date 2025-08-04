

import profileModel from '../../models/profile.js';
import userModel from '../../models/User.js';
import mongoose from 'mongoose';
// GET ALL USERS WITHOUT PASSWORD
export const allUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, '-password'); 
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// UPDATE THE ROLE OF A USER
export const updateUserRole = async (req, res) => {
  const { userId, newRole } = req.body;

  // Only admin can update user roles
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Validate role
  if (!['student', 'teacher', 'admin'].includes(newRole)) {
    return res.status(400).json({ error: 'Invalid role provided' });
  }

  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'Role updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  // Only admin can delete users
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// GET USERS WITH PROFILE INFO




export const getUserWithProfileById = async (req, res) => {
  const { userId } = req.params;
  console.log("UserId"+userId)
  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    // Find user by ID excluding password
    const user = await userModel.findById(userId, '-password').lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find profile linked to this user
    const profile = await profileModel.findOne({ user: userId }).lean();
    console.log("Profile"+profile)
    // Combine user and profile data
    const userWithProfile = {
      ...user,
      profileId: profile?._id || null,
      name: profile?.name || null,
      phone: profile?.phone || null,
      university: profile?.university || null,
      country: profile?.country || null,
    };

    return res.status(200).json(userWithProfile);

  } catch (error) {
    console.error('Error fetching user with profile:', error);
    return res.status(500).json({ error: 'Failed to fetch user with profile' });
  }
};



export const assignSectionToStudent = async (req, res) => {
  const { userId, section } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can assign sections.' });
  }

  if (!userId || !section) {
    return res.status(400).json({ error: 'userId and section are required.' });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role !== 'student') {
      return res.status(400).json({ error: 'Cannot assign section to teachers or admins.' });
    }

    // One section only
    user.section = [section];
    await user.save();

    res.status(200).json({ message: 'Section assigned successfully.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to assign section.' });
  }
};


