import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../../models/User.js';
import { jwtSecret, nodeEnv } from '../../config/config.js';

export const Login = async (req, res) => {
  const { email, password } = req.body;

  // 🧪 Basic manual input validations
  if (!email || !password) {
    return res.status(400).json({ message: 'Both email and password are required.' });
  }

  // ✅ Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // ✅ Validate password length (optional here but good practice)
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    // === Special admin login check ===
    if (email === 'admin@gmail.com' && password === 'admin123') {
      // Generate JWT token for admin
      const token = jwt.sign(
        { id: 'adminId123', email, role: 'admin' }, // fake admin id
        jwtSecret,
        { expiresIn: '1d' }
      );

      // Set cookie for admin
      res.cookie('token', token, {
        httpOnly: true,
        secure: nodeEnv === 'production',
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: 'Admin login successful',
        user: {
          id: 'adminId123',
          email,
          role: 'admin',
        },
      });
    }

    // 🔍 Check if user exists (normal user flow)
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 🔐 Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 🎫 Generate JWT token for normal user
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '1d' }
    );

    // 🍪 Set secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
