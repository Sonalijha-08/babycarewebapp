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
app.use(cors());
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
