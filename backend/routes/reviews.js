const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// GET /api/reviews/:serviceId
// Fetch reviews for a specific service
router.get('/:serviceId', async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/reviews/:serviceId
// Add a review to a service
router.post('/:serviceId', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const serviceId = req.params.serviceId;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ user: req.user.id, service: serviceId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }

    const newReview = new Review({
      user: req.user.id,
      service: serviceId,
      rating: Number(rating),
      comment
    });

    await newReview.save();

    // Recalculate average rating
    const allReviews = await Review.find({ service: serviceId });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    
    service.rating = avgRating.toFixed(1);
    service.reviewCount = allReviews.length;
    await service.save();

    res.json(newReview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
