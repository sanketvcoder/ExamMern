import Profile from '../../models/profile.js';
import User from '../../models/User.js';

// Create profile
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, country, university } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Phone must be exactly 10 digits.' });
    }
    if (!country || country.trim() === '') {
      return res.status(400).json({ success: false, message: 'Country is required.' });
    }
    if (!university || university.trim() === '') {
      return res.status(400).json({ success: false, message: 'University is required.' });
    }

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ success: false, message: 'Profile already exists' });
    }

    const profile = new Profile({
      user: userId,
      name: name.trim(),
      phone,
      country: country.trim(),
      university: university.trim(),
    });

    await profile.save();

    // Mark user as profile created
    await User.findByIdAndUpdate(userId, { profileCreated: true });

    res.status(201).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


// Get profile


export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID missing from request' });
    }

    console.log("🔍 Fetching profile for user ID:", userId);

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    console.log("✅ Fetched profile:", profile);
    return res.status(200).json({ success: true, profile });

  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message,
    });
  }
};


// Update profile
export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Mark user as profile not created
    await User.findByIdAndUpdate(req.user._id, { profileCreated: false });

    res.json({ success: true, message: 'Profile deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Deletion failed', error: error.message });
  }
};
