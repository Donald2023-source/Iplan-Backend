const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const Session = require('../models/Session');
const Term = require('../models/Term');
const LessonPlan = require('../models/lessonPlan'); // Correct capitalization
const Subject = require('../models/Subjects'); // Import Subject model
const Comment = require('../models/comment'); // Correct capitalization
const classes = require('../data/classes');
const juniorSubjects = require('../data/juniorSubjects');
const seniorSubjects = require('../data/seniorSubjects');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/'); // Upload destination directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Naming convention for uploaded files
  }
});
const upload = multer({ storage });

// Session routes
router.post('/', async (req, res) => {
  try {
    const { name, year, startDate, endDate } = req.body;
    if (!name || !year || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newSession = new Session({ name, year, startDate, endDate });
    await newSession.save();
    res.status(201).json({ message: 'New session created', newSession });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, year, startDate, endDate } = req.body;
    if (!name || !year || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const session = await Session.findByIdAndUpdate(req.params.id, { name, year, startDate, endDate }, { new: true, runValidators: true });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Term routes
router.post('/:sessionId/terms', async (req, res) => {
  try {
    const term = new Term({ ...req.body, sessionId: req.params.sessionId });
    await term.save();
    res.status(201).json({ message: 'New term created successfully', term });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:sessionId/terms', async (req, res) => {
  try {
    const terms = await Term.find({ sessionId: req.params.sessionId });
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:sessionId/terms/:id', async (req, res) => {
  try {
    const term = await Term.findByIdAndDelete(req.params.id);
    if (!term) {
      return res.status(404).json({ error: 'Term not found' });
    }
    res.status(200).json({ message: 'Term deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch Classes
router.get('/:sessionId/terms/:termId/classes', async (req, res) => {
  try {
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subject routes
router.get('/:sessionId/terms/:termId/classes/:classId/subjects', (req, res) => {
  const classId = parseInt(req.params.classId, 10);
  let subjects;
  if (classId >= 1 && classId <= 3) { // Junior classes (JSS1 to JSS3)
    subjects = juniorSubjects;
  } else if (classId >= 4 && classId <= 6) { // Senior classes (SSS1 to SSS3)
    subjects = seniorSubjects;
  } else {
    return res.status(400).json({ error: 'Invalid class ID' });
  }
  res.status(200).json(subjects);
});

// Lesson Plan Routes
router.post('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans', upload.single('lessonPlan'), async (req, res) => {
  const { title } = req.body;
  if (!title || !req.file) {
    return res.status(400).json({ message: 'Title and file are required' });
  }

  const { filename } = req.file;
  try {
    const lessonPlan = new LessonPlan({
      title,
      file: filename,
      sessionId: req.params.sessionId,
      termId: req.params.termId,
      classId: req.params.classId,
      subjectId: parseInt(req.params.subjectId),
      comments: []
    });
    await lessonPlan.save();

    const subject = (parseInt(req.params.classId) >= 1 && parseInt(req.params.classId) <= 3)
      ? juniorSubjects.find(sub => sub.id === parseInt(req.params.subjectId))
      : seniorSubjects.find(sub => sub.id === parseInt(req.params.subjectId)) || { name: 'Unknown Subject' };

    // Fetch existing lesson plans
    const existingLessonPlans = await LessonPlan.find({
      sessionId: new mongoose.Types.ObjectId(req.params.sessionId),
      termId: new mongoose.Types.ObjectId(req.params.termId),
      classId: req.params.classId,
      subjectId: parseInt(req.params.subjectId)
    });

    res.status(201).json({
      message: 'Lesson plan uploaded successfully',
      lessonPlan: {
        ...lessonPlan.toObject(),
        subjectName: subject.name
      },
      existingLessonPlans // Send existing lesson plans along with the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:sessionId/terms/:termId/classes/:classId/lessonPlans', async (req, res) => {
  try {
    const lessonPlans = await LessonPlan.find({
      sessionId: new mongoose.Types.ObjectId(req.params.sessionId),
      termId: new mongoose.Types.ObjectId(req.params.termId),
      classId: parseInt(req.params.classId)
    }).populate('sessionId termId classId subjectId comments', 'name text');

    if (!lessonPlans.length) {
      return res.status(404).json({ error: 'No lesson plans found for the specified criteria' });
    }

    const updatedLessonPlans = lessonPlans.map(lessonPlan => {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${lessonPlan.file}`;

      const subjectId = lessonPlan.subjectId;
      const subject = (parseInt(req.params.classId) >= 1 && parseInt(req.params.classId) <= 3)
        ? juniorSubjects.find(sub => sub.id === subjectId)
        : seniorSubjects.find(sub => sub.id === subjectId);

      return {
        ...lessonPlan.toObject(),
        subjectName: subject ? subject.name : 'Unknown Subject',
        fileUrl
      };
    });

    res.status(200).json(updatedLessonPlans);
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans', async (req, res) => {
  try {
    const lessonPlans = await LessonPlan.find({
      sessionId: new mongoose.Types.ObjectId(req.params.sessionId),
      termId: new mongoose.Types.ObjectId(req.params.termId),
      classId: parseInt(req.params.classId),
      subjectId: parseInt(req.params.subjectId)
    }).populate('sessionId termId classId comments', 'name text');

    if (!lessonPlans.length) {
      return res.status(404).json({ error: 'No lesson plans found for the specified criteria' });
    }

    const updatedLessonPlans = lessonPlans.map(lessonPlan => {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${lessonPlan.file}`;

      const subjectId = lessonPlan.subjectId;
      const subject = (parseInt(req.params.classId) >= 1 && parseInt(req.params.classId) <= 3)
        ? juniorSubjects.find(sub => sub.id === subjectId)
        : seniorSubjects.find(sub => sub.id === subjectId);

      return {
        ...lessonPlan.toObject(),
        subjectName: subject ? subject.name : 'Unknown Subject',
        fileUrl
      };
    });

    res.status(200).json(updatedLessonPlans);
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    res.status(500).json({ error: error.message });
  }
});

// Comment routes
router.post('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans/:lessonPlanId/comments', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const comment = new Comment({
      text,
      lessonPlanId: req.params.lessonPlanId
    });
    await comment.save();

    const lessonPlan = await LessonPlan.findById(req.params.lessonPlanId);
    if (!lessonPlan) {
      return res.status(404).json({ message: 'Lesson plan not found' });
    }

    lessonPlan.comments.push(comment._id);
    await lessonPlan.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans/:lessonPlanId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ lessonPlanId: req.params.lessonPlanId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans/:lessonPlanId/comments/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const lessonPlan = await LessonPlan.findById(req.params.lessonPlanId);
    if (!lessonPlan) {
      return res.status(404).json({ message: 'Lesson plan not found' });
    }

    lessonPlan.comments.pull(comment._id);
    await lessonPlan.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
