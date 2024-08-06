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
const sessionRoutes = require('./routes/sessionRoutes')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './uploads'))); // Ensure correct path

app.use(session({
  secret: process.env.SESSION_SECRET || 'someRandomSessionSecret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passport'); 
mongodb://127.0.0.1:27017/st_christophers
mongoose.connect('mongodb+srv://donalddyusuf:orVEZja4ABJlb5ZP@st-christophers.trvhc.mongodb.net/?retryWrites=true&w=majority&appName=St-Christophers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
