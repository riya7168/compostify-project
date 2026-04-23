const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Service = require('../models/Service');

dotenv.config();

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/compostify';
    console.log(`Connecting to ${mongoUri}`);
    await mongoose.connect(mongoUri);

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});

    const salt = await bcrypt.genSalt(10);

    // Create admin
    const adminPassword = await bcrypt.hash('admin123', salt);
    const admin = await new User({
      name: 'System Admin',
      email: 'admin@compostify.com',
      password: adminPassword,
      role: 'admin',
      isVerified: true
    }).save();
    console.log('✅ Admin user created (admin@compostify.com / admin123)');

    // Create expert users
    const expert1 = await new User({
      name: 'Priya Sharma',
      email: 'priya@compostify.com',
      password: await bcrypt.hash('expert123', salt),
      role: 'expert',
      isVerified: true
    }).save();

    const expert2 = await new User({
      name: 'Rohan Verma',
      email: 'rohan@compostify.com',
      password: await bcrypt.hash('expert123', salt),
      role: 'expert',
      isVerified: true
    }).save();

    const expert3 = await new User({
      name: 'Anita Desai',
      email: 'anita@compostify.com',
      password: await bcrypt.hash('expert123', salt),
      role: 'expert',
      isVerified: true
    }).save();

    console.log('✅ Expert users created');

    // Seed services with all new types
    const services = [
      {
        provider: expert1._id,
        title: 'Home Composting Starter Kit & Setup',
        description: 'Complete home composting setup including bin selection, layering guidance, and a 3-month support plan.',
        serviceType: 'home_composting',
        location: 'Delhi',
        price: 1500,
        rating: 4.8,
        reviewCount: 24
      },
      {
        provider: expert2._id,
        title: 'Bulk Organic Waste Collection',
        description: 'Weekly bulk organic waste collection for apartments and commercial complexes. Includes sorting and transport.',
        serviceType: 'bulk_waste',
        location: 'Mumbai',
        price: 3500,
        rating: 4.6,
        reviewCount: 18
      },
      {
        provider: expert1._id,
        title: 'Compost Pickup — Fortnightly',
        description: 'Fortnightly compost material pickup from your doorstep. We process it at our facility and return finished compost.',
        serviceType: 'pickup',
        location: 'Bangalore',
        price: 800,
        rating: 4.9,
        reviewCount: 42
      },
      {
        provider: expert3._id,
        title: '1-on-1 Composting Consultation',
        description: 'Personalised 60-minute video or in-person consultation. Troubleshoot your compost pile, optimise ratios, and get expert tips.',
        serviceType: 'consultation',
        location: 'Online',
        price: 500,
        rating: 5.0,
        reviewCount: 11
      },
      {
        provider: expert2._id,
        title: 'Vermicomposting (Worm Farm) Setup',
        description: 'Set up a thriving worm farm at home or office. Includes live worms, bedding, and a 2-month check-in schedule.',
        serviceType: 'vermicomposting',
        location: 'Delhi',
        price: 2200,
        rating: 4.7,
        reviewCount: 15
      },
      {
        provider: expert3._id,
        title: 'Community Composting Hub Management',
        description: 'Design, set up, and manage a shared composting hub for housing societies or community gardens.',
        serviceType: 'community_composting',
        location: 'Pune',
        price: 8000,
        rating: 4.5,
        reviewCount: 8
      },
      {
        provider: expert1._id,
        title: 'Compost-Enriched Garden Soil Supply',
        description: 'Fresh, ready-to-use compost-enriched potting soil delivered to your doorstep. Available in 10kg, 25kg, and 50kg bags.',
        serviceType: 'garden_soil_supply',
        location: 'Bangalore',
        price: 400,
        rating: 4.8,
        reviewCount: 33
      },
      {
        provider: expert2._id,
        title: 'Compost Bin / Tumbler Rental',
        description: 'Monthly rental of high-quality composting tumblers. No upfront investment — perfect for beginners.',
        serviceType: 'compost_bin_rental',
        location: 'Mumbai',
        price: 250,
        rating: 4.4,
        reviewCount: 20
      },
      {
        provider: expert3._id,
        title: 'Composting Workshop (Group)',
        description: 'Hands-on 3-hour workshop for up to 20 participants. Covers hot composting, cold composting, troubleshooting, and Q&A.',
        serviceType: 'workshop_training',
        location: 'Hyderabad',
        price: 1200,
        rating: 4.9,
        reviewCount: 27
      },
      {
        provider: expert1._id,
        title: 'Organic Waste Audit & Report',
        description: 'Full audit of your household or business organic waste streams. Get a detailed report with composting recommendations and potential savings.',
        serviceType: 'waste_audit',
        location: 'Online',
        price: 1800,
        rating: 4.6,
        reviewCount: 9
      }
    ];

    await Service.insertMany(services);
    console.log(`✅ ${services.length} services seeded with all service types`);

    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
