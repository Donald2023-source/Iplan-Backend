const express = require('express');
const session = require('express-session'); // Correct import for express-session
const app = express();
const port = process.env.PORT || 4000;

// Middleware setup for session
app.use(session({
  secret: '1172', 
  resave: false,
  saveUninitialized: false
}));

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
