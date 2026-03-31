const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const scheduleDailyReset = require('./utils/dailyReset');
const scheduleFeedingReminders = require('./utils/reminderScheduler');
const { sendEmail } = require('./utils/resendEmail');

const authRoutes = require('./routes/authRoutes');
const feedingRoutes = require('./routes/feedingRoutes');
const sleeplogRoutes = require('./routes/sleeplogRoutes');
const diaperlogRoutes = require('./routes/diaperlogRoutes');
const growthtrackerRoutes = require('./routes/growthtrackerRoutes');
const vaccinationsRoutes = require('./routes/vaccinationsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'https://babycarewebapp-frontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS: Not allowed by policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/feeding', feedingRoutes);
app.use('/api/sleeplog', sleeplogRoutes);
app.use('/api/diaperlog', diaperlogRoutes);
app.use('/api/growthtracker', growthtrackerRoutes);
app.use('/api/vaccinations', vaccinationsRoutes);

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
