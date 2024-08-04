const express = require('express');
const { subjects, classes } = require('../staticData');

const router = express.Router();

// Route to get all static subjects
router.get('/subjects', (req, res) => {
  res.status(200).json(subjects);
});

// Route to get all static classes
router.get('/classes', (req, res) => {
  res.status(200).json(classes);
});

module.exports = router;
