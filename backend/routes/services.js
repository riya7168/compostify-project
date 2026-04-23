const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// GET /api/services
// Get all services with optional filters
router.get('/', async (req, res) => {
  try {
    const { location, serviceType, minPrice, maxPrice, searchQuery } = req.query;
    
    let query = {};
    if (location) query.location = { $regex: location, $options: 'i' };
    if (serviceType) query.serviceType = serviceType;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    const services = await Service.find(query).populate('provider', 'name email isVerified');
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/services
// Add a new service (experts only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'expert' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create services' });
    }

    const { title, description, serviceType, location, price } = req.body;

    const newService = new Service({
      provider: req.user.id,
      title,
      description,
      serviceType,
      location,
      price
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
