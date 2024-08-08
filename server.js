const express = require('express');
const session = require('express-session'); // Correct import for express-session
const MongoStore = require('connect-mongo');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 4000;

// Middleware setup for session
const session = require('express-session');
const MongoStore = require('connect-mongo');


// const corsOptions = {
//   origin: 'https://your-production-domain.com', // Set this to your front-end's URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// // Apply the CORS middleware
// app.use(cors(corsOptions));
app.use(
  session({
    secret: '1172',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://donalddyusuf:orVEZja4ABJlb5ZP@st-christophers.trvhc.mongodb.net/?retryWrites=true&w=majority', 
    }),
    cookie: { secure: true, maxAge: 60000 },
  })
);

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
