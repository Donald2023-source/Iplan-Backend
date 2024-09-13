const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/authRoutes');
const lessonPlanRoutes = require('./routes/lessonPlanRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to match your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // If you need to allow cookies or other credentials
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'someRandomSessionSecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://donalddyusuf:orVEZja4ABJlb5ZP@st-christophers.trvhc.mongodb.net/?retryWrites=true&w=majority',
    // mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/st_christophers',
    collectionName: 'sessions'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passport'); // Initialize Passport

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://donalddyusuf:orVEZja4ABJlb5ZP@st-christophers.trvhc.mongodb.net/?retryWrites=true&w=majority', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lesson-plans', lessonPlanRoutes);
app.use('/sessions', sessionRoutes); // Ensure this path matches client-side request

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
