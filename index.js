const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const lessonPlanRoutes = require('./routes/lessonPlanRoutes');
const path = require('path');
const sessionRoutes = require('./routes/sessionRoutes');
const MongoStore = require('connect-mongo')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Alternatively, for a more permissive setup during development
app.use(cors()); // This will allow requests from any origin

app.use(bodyParser.json());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './uploads'))); // Ensure correct path

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority';

app.use(session({
  secret: process.env.SESSION_SECRET || 'someRandomSessionSecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://donalddyusuf:orVEZja4ABJlb5ZP@st-christophers.trvhc.mongodb.net/?retryWrites=true&w=majority',
    collectionName: 'sessions'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passport'); 

mongoose.connect('mongodb+srv://donalddyusuf:orVEZja4ABJlb5ZP@st-christophers.trvhc.mongodb.net/?retryWrites=true&w=majority', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.use('/api/auth', authRoutes);
app.use('/api/lesson-plans', lessonPlanRoutes);
app.use('/sessions', sessionRoutes); // Ensure this path matches client-side request


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
