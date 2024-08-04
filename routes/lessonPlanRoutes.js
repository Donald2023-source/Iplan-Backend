const express = require('express');
const multer = require('multer');
const LessonPlan = require('../models/lessonPlan');

const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Upload destination directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Naming convention for uploaded files
  }
});

const upload = multer({ storage: storage });

// Upload lesson plan route
router.post('/upload', upload.single('lessonPlan'), async (req, res) => {
  const { subject, term, title, session, classId } = req.body;
  console.log('Request Body:', req.body); // Log request body
  console.log('File:', req.file); // Log file data

  if (!subject || !term || !title || !session || !classId || !req.file) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const { filename, path, mimetype, size } = req.file;

  try {
    const lessonPlan = new LessonPlan({
      subject,
      term,
      title,
      session,
      class: classId,
      filename,
      path,
      mimetype,
      size
    });
    await lessonPlan.save();

    res.status(200).json({ message: 'Lesson plan uploaded successfully', lessonPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add comment to lesson plan (admin only)
router.post('/:id/comment', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const lessonPlan = await LessonPlan.findById(id);

    if (!lessonPlan) {
      return res.status(404).json({ message: 'Lesson plan not found' });
    }

    const comment = {
      adminId: req.user._id,
      text,
      timestamp: new Date()
    };

    lessonPlan.comments.push(comment);
    await lessonPlan.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    res.status500.json({ error: error.message });
  }
});

// Get comments for a lesson plan (accessible to all users)
router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;

  try {
    const lessonPlan = await LessonPlan.findById(id).populate('comments.adminId', 'name');
    if (!lessonPlan) {
      return res.status(404).json({ message: 'Lesson plan not found' });
    }

    res.status(200).json({ comments: lessonPlan.comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/session/:sessionId/term/:termId', async (req, res) => {
  const { sessionId, termId} = req.params;

  try {
    const lessonPlans = await LessonPlan.find({ session: sessionId, term: termId});
    res.status(200).json(lessonPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
