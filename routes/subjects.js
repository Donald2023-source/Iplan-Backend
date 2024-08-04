const express = require('express');
const { juniorSubjects, seniorSubjects } = require('../staticData');

const router = express.Router();

// Fetch all subjects for a class
router.get('/classes/:classId/subjects', (req, res) => {
    const classId = parseInt(req.params.classId, 10);
  
    let subjects;
    if (classId <= 3) { // Assuming class IDs 1, 2, 3 are for junior classes
      subjects = juniorSubjects;
    } else { // Assuming class IDs 4, 5, 6 are for senior classes
      subjects = seniorSubjects;
    }
  
    res.status(200).json(subjects);
  });