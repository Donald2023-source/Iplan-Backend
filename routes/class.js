const express = require('express');
const { classes } = require('../data/classes');

const router = express.Router();

// Fetch all classes for a week
router.get('/weeks/:weekId/classes', async (req, res) => {
    try {
      // Assuming you have some predefined classes for any weekId
      // You can replace this with data fetched from your database if needed
      const classesForWeek = classes.filter(classItem => classItem.weekId === req.params.weekId);
  
      res.status(200).json(classesForWeek);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
module.exports = router;
