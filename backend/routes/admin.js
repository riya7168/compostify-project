const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Middleware to ensure admin
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// GET /api/admin/users
// Get all users (for expert verification)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['expert', 'user'] } }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PATCH /api/admin/users/:id/verify
// Toggle expert verification
router.patch('/users/:id/verify', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isVerified = !user.isVerified;
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/admin/stats
// Get holistic platform stats
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalExperts = await User.countDocuments({ role: 'expert' });
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    res.json({ totalUsers, totalExperts, totalServices, totalBookings });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

// GET /api/admin/bookings
// Get ALL bookings across the platform (admin only)
router.get('/bookings', auth, adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('service', 'title')
      .populate('user', 'name email')
      .populate('provider', 'name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
