

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const lessonPlanRoutes = require('./routes/lessonPlanRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
require('dotenv').config();
const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Use environment variable for frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Session setup


app.use(passport.initialize());
app.use(passport.session());

require('./auth/passport'); // Ensure passport configuration is correct

// Connect to MongoDB
mongoose.connect('mongodb+srv://donalddyusuf:WXcI7pndqPQW9vt3@mydatabase.o2rvqvt.mongodb.net/', {
  tls: true,
  serverSelectionTimeoutMS: 50000, // Increased timeout
  socketTimeoutMS: 60000, // Increased timeout
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err.message); // Log error message
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lesson-plans', lessonPlanRoutes);
app.use('/sessions', sessionRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
