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


// ✅ ✅ FIXED CORS (IMPORTANT)
app.use(cors({
  origin: "*",   // allow all (fixes your issue)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Handle preflight requests (VERY IMPORTANT)
app.options("*", cors());


// Middleware
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

    // Start schedulers
    try {
      scheduleDailyReset();
    } catch (err) {
      console.error('Daily reset error:', err);
    }

    try {
      scheduleFeedingReminders();
    } catch (err) {
      console.error('Reminder scheduler error:', err);
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });