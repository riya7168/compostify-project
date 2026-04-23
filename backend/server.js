const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/compostify';

// Allow all common local dev ports + any origin listed in .env
const ALLOWED_ORIGINS = [
  'http://localhost:3000',   // npx serve
  'http://127.0.0.1:3000',
  'http://localhost:5173',   // Vite
  'http://127.0.0.1:5173',
  'http://localhost:5500',   // VS Code Live Server
  'http://127.0.0.1:5500',
  'http://localhost:5501',
  'http://127.0.0.1:5501',
  'http://localhost:8080',   // http-server / webpack
  'http://127.0.0.1:8080',
  'http://localhost:4200',   // Angular
  'http://127.0.0.1:4200',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
];

if (process.env.FRONTEND_URL) {
  ALLOWED_ORIGINS.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman, mobile apps, file://)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    console.warn(`⚠️  CORS blocked request from: ${origin}`);
    console.warn(`   Add it to ALLOWED_ORIGINS in server.js or set FRONTEND_URL in .env`);
    return callback(new Error(`CORS: origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Compostify backend is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

async function seedAdmin() {
  const existingAdmin = await User.findOne({ email: 'admin@compostify.com' });
  if (existingAdmin) return;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  await new User({
    name: 'System Admin',
    email: 'admin@compostify.com',
    password: hashedPassword,
    role: 'admin',
    isVerified: true
  }).save();

  console.log('✅ Base Admin Seeded (admin@compostify.com / admin123)');
}

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB connected: ${MONGO_URI}`);

    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`   Allowed frontend origins: ${ALLOWED_ORIGINS.slice(0, 4).join(', ')} ...`);
      console.log(`   To add a new origin, set FRONTEND_URL=http://yourhost:port in .env`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error.message);
    console.error('   Make sure MongoDB is running and MONGO_URI in backend/.env is correct.');
    process.exit(1);
  }
}

startServer();
