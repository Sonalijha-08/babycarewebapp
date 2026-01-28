const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/feeding', feedingRoutes);
app.use('/api/sleeplog', sleeplogRoutes);
app.use('/api/diaperlog', diaperlogRoutes);
app.use('/api/growthtracker', growthtrackerRoutes);
app.use('/api/vaccinations', vaccinationsRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    app.use("/api/feeding", feedingRoutes);
    app.use("/api/sleeplog", sleeplogRoutes);


  });
