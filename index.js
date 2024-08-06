const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const lessonPlanRoutes = require('./routes/lessonPlanRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
require('dotenv').config();
const { connect } = require('./connect'); // Import connect function

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'someRandomSessionSecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://donalddyusuf:WXcI7pndqPQW9vt3@mydatabase.o2rvqvt.mongodb.net/?retryWrites=true&w=majority', // Provide MongoDB URI here
  }),
}));

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passport'); // Ensure passport configuration is correct

// Connect to MongoDB
connect().then(() => {
  // Start the server only after successful MongoDB connection
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(console.dir);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lesson-plans', lessonPlanRoutes);
app.use('/sessions', sessionRoutes);
