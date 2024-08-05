const express = require('express');
const session = require('express-session'); // Correct import for express-session
const MongoStore = require('connect-mongo');
const app = express();
const port = process.env.PORT || 4000;

// Middleware setup for session
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(
  session({
    secret: '1172',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/mydatabase', // Use your MongoDB connection string
    }),
    cookie: { secure: true, maxAge: 60000 }, // Example cookie settings
  })
);

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
