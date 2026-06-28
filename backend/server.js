const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const scheduleDailyReset = require('./utils/dailyReset');
const scheduleFeedingReminders = require('./utils/reminderScheduler');
const { sendEmail } = require('./utils/resendEmail');

const authRoutes = require('./routes/authRoutes');
const feedingRoutes = require('./routes/feedingRoutes');
const sleeplogRoutes = require('./routes/sleeplogRoutes');
const diaperlogRoutes = require('./routes/diaperlogRoutes');
const growthtrackerRoutes = require('./routes/growthtrackerRoutes');
const vaccinationsRoutes = require('./routes/vaccinationsRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ──────────────────────────────────────────────────────────
// Manually set CORS headers on every response so preflight OPTIONS
// requests are never rejected — even if the server is waking up.
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://babycarewebapp-z5k9.vercel.app', // explicit Vercel URL
  process.env.FRONTEND_URL || '',
];

app.use((req, res, next) => {
  const origin = req.headers.origin || '';

  console.log(`[CORS] ${req.method} ${req.path} — origin: "${origin}"`);

  // Allow: exact match, any *.vercel.app, any localhost
  const isAllowed =
    !origin ||
    ALLOWED_ORIGINS.includes(origin) ||
    origin.includes('vercel.app') ||
    origin.includes('localhost');

  // Always set CORS headers — use matched origin or wildcard fallback
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? (origin || '*') : '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');

  // Respond immediately to preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test email endpoint
app.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "fit084sonalijha@gmail.com",
      "Resend Test",
      "Email test",
      "<h1>Email Working 🎉</h1>"
    );
    res.send("Email sent successfully!");
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).send("Email failed: " + error.message);
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Baby Care API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/feeding', feedingRoutes);
app.use('/api/sleeplog', sleeplogRoutes);
app.use('/api/diaperlog', diaperlogRoutes);
app.use('/api/growthtracker', growthtrackerRoutes);
app.use('/api/vaccinations', vaccinationsRoutes);
app.use('/api/profile', profileRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start daily reset job to clear previous-day logs
    try {
      scheduleDailyReset();
    } catch (err) {
      console.error('Failed to start daily reset scheduler:', err);
    }
    // Start persistent reminder scheduler
    try {
      scheduleFeedingReminders();
    } catch (err) {
      console.error('Failed to start reminder scheduler:', err);
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
