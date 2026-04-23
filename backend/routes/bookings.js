const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { sendEmail } = require('../utils/mailer');

// POST /api/bookings
router.post('/', auth, async (req, res) => {
  try {
    const { serviceId, scheduledDate, notes } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const newBooking = new Booking({
      user: req.user.id,
      service: serviceId,
      provider: service.provider,
      scheduledDate,
      notes
    });

    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/bookings
router.get('/', auth, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'expert') {
      bookings = await Booking.find({ provider: req.user.id })
        .populate('service', 'title')
        .populate('user', 'name email');
    } else {
      bookings = await Booking.find({ user: req.user.id })
        .populate('service', 'title')
        .populate('provider', 'name');
    }
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PATCH /api/bookings/:id/status
// BUG FIX: This route was defined AFTER module.exports in the original file,
// so it was never registered. Moved above module.exports.
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('service', 'title');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    await sendEmail({
      to: booking.user.email,
      subject: `Booking Update: ${status.toUpperCase()} - ${booking.service.title}`,
      body: `Hi ${booking.user.name},\nYour booking for "${booking.service.title}" has been updated to: ${status}.\n\nThank you for using Compostify!`
    });

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
