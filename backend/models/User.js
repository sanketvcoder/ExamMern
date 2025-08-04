import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  section:{
    type:Array,
    default: ["all"],
  },
  resetPasswordOtp: {
    type: Number,
    default: 0,
  },
  verifyEmailOtp: {
    type: Number,
    default: 0
},
  isVerified: {
    type: Boolean, 
    default: false,
  },
  verifyEmail: {
    type: Boolean,
    default: false,
  },
  profileCreated: {
    type: Boolean,
    default: false,
  },
  expiresResetOtp: {
    type: Date,
    default: null, // null means no OTP generated yet or expired
  },
    expiresVerifyEmailOtp: {
    type: Date,
    default: null, // null means no OTP generated yet or expired
  },

}, {
  timestamps: true,
});

const userModel = mongoose.model('User', userSchema);
export default userModel;
