const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'expert', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false }, // Experts require verification

  // OTP Login Verification
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  otpVerified: { type: Boolean, default: false },

  // Password Reset OTP
  resetOtp: { type: String, default: null },
  resetOtpExpiry: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
