const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const Session = require('../models/Session');
const Term = require('../models/Term');
const LessonPlan = require('../models/lessonPlan'); // Correct capitalization
const Subject = require('../models/Subjects'); // Import Subject model
const Comment = require('../models/comment');
const classes = require('../data/classes');
const juniorSubjects = require('../data/juniorSubjects');
const seniorSubjects = require('../data/seniorSubjects');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lesson_plans',
    allowedFormats: ['pdf'],
    resource_type: 'raw' // For raw files like PDFs
  },
});

const upload = multer({ storage: storage });




const router = express.Router();

// Session routes
router.post('/', async (req, res) => {
  try {
    const { name, year, startDate, endDate } = req.body;
    if (!name || !year || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newSession = new Session({ name, year, startDate, endDate });
    await newSession.save();
    res.status(201).json({ message: 'New session Created', newSession });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'something went wrong', error: error.message });
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
    res.status(201).json({ message: 'New term created SuccessFully', term });
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
    const termId = req.params.id;
    const term = await Term.findByIdAndDelete(termId);
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

router.post('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans', upload.single('lessonPlan'), async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the request body
    console.log('File:', req.file); // Log the uploaded file info

    const { title } = req.body;
    const file = req.file;

    if (!title || !file) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // The file URL is directly available from `req.file`
    const fileUrl = file.path;

    const lessonPlan = new LessonPlan({
      title,
      file: fileUrl,
      sessionId: req.params.sessionId,
      termId: req.params.termId,
      classId: parseInt(req.params.classId),
      subjectId: parseInt(req.params.subjectId),
      comments: []
    });

    await lessonPlan.save();
    res.status(201).json({ message: 'Lesson plan uploaded successfully', lessonPlan });
  } catch (error) {
    console.error('Error uploading lesson plan:', error);
    res.status(500).json({ error: error.message });
  }
});









// Fetch lesson plans by class
// Fetch lesson plans by class
router.get('/:sessionId/terms/:termId/classes/:classId/lessonPlans', async (req, res) => {
  try {
    const { sessionId, termId, classId } = req.params;
router.post('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans', upload.single('lessonPlan'), async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!title || !file) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('Title:', title);
    console.log('File:', file);
    console.log('File buffer length:', file.buffer.length); // Check buffer length

    // Handle file upload
    cloudinary.uploader.upload_stream({ resource_type: 'auto', folder: 'lesson_plans' }, async (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log('Cloudinary upload result:', result);

      const lessonPlan = new LessonPlan({
        title,
        file: result.secure_url, // Store the file URL
        sessionId: req.params.sessionId,
        termId: req.params.termId,
        classId: req.params.classId,
        subjectId: parseInt(req.params.subjectId),
        comments: []
      });

      await lessonPlan.save();
      res.status(201).json({ message: 'Lesson plan uploaded successfully', lessonPlan });
    }).end(file.buffer);

  } catch (error) {
    console.error('Error uploading lesson plan:', error);
    res.status(500).json({ error: error.message });
  }
});

    const lessonPlans = await LessonPlan.find({
      sessionId: new mongoose.Types.ObjectId(sessionId),
      termId: new mongoose.Types.ObjectId(termId),
      classId: parseInt(classId) // Ensure classId is numeric
    }).populate('sessionId termId classId subjectId comments', 'name text'); // Populate comments with their text

    if (!lessonPlans.length) {
      return res.status(404).json({ error: 'No lesson plans found for the specified criteria' });
    }

    const updatedLessonPlans = lessonPlans.map(lessonPlan => {
      const fileUrl = `${"https"}://${req.get('host')}/uploads/${lessonPlan.file}`;

      // Determine the subject name based on the subject ID
      let subjectName = 'Unknown Subject';
      const subjectId = lessonPlan.subjectId;

      if (parseInt(classId) >= 1 && parseInt(classId) <= 3) {
        const subject = juniorSubjects.find(sub => sub.id === subjectId);
        if (subject) subjectName = subject.name;
      } else if (parseInt(classId) >= 4 && parseInt(classId) <= 6) {
        const subject = seniorSubjects.find(sub => sub.id === subjectId);
        if (subject) subjectName = subject.name;
      }

      return {
        ...lessonPlan.toObject(),
        subjectName,
        fileUrl,
      };
    });

    res.status(200).json(updatedLessonPlans);
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    res.status(500).json({ error: error.message });
  }
});




// Fetch lesson plans by subject and class
router.get('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Content-Type', 'application/pdf');

  try {
    const { sessionId, termId, classId, subjectId } = req.params;

    res.setHeader('Content-Disposition', 'inline'); // This ensures the file opens in the browser
    res.setHeader('Content-Type', 'application/pdf');

    const lessonPlans = await LessonPlan.find({
      sessionId: new mongoose.Types.ObjectId(sessionId),
      termId: new mongoose.Types.ObjectId(termId),
      classId: parseInt(classId), // Ensure classId is numeric
      subjectId: parseInt(subjectId) // Ensure subjectId is numeric
    }).populate('sessionId termId classId comments', 'name text'); // Populate comments with their text

    if (!lessonPlans.length) {
      return res.status(404).json({ error: 'No lesson plans found for the specified criteria' });
    }

    let subject;
    if (parseInt(classId) >= 1 && parseInt(classId) <= 3) {
      subject = juniorSubjects.find(sub => sub.id === parseInt(subjectId));
    } else {
      subject = seniorSubjects.find(sub => sub.id === parseInt(subjectId));
    }

    if (!subject) {
      subject = { name: 'Unknown Subject' };
    }

    const updatedLessonPlans = lessonPlans.map(lessonPlan => {
      const fileUrl = `${"https"}://${req.get('host')}/uploads/${lessonPlan.file}`;
      return {
        ...lessonPlan.toObject(),
        subjectName: subject.name,
        fileUrl
      };
    });

    res.status(200).json(updatedLessonPlans);
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    res.status(500).json({ error: error.message });
  }
});


// Update lesson plan
router.put('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans/:lessonPlanId', upload.single('lessonPlan'), async (req, res) => {
  try {
    const { lessonPlanId } = req.params;
    const { title } = req.body;
    const file = req.file;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Find the existing lesson plan
    const existingLessonPlan = await LessonPlan.findById(lessonPlanId);
    if (!existingLessonPlan) {
      return res.status(404).json({ error: 'Lesson plan not found' });
    }

    // Delete the old file if a new file is uploaded
    if (file && existingLessonPlan.file) {
      const oldFilePath = `./uploads/${existingLessonPlan.file}`;
      fs.unlink(oldFilePath, (err) => {
        if (err) console.error('Error deleting old file:', err);
      });
    }

    // Update the lesson plan with the new data
    const updateData = { title };
    if (file) {
      updateData.file = file.filename; // Store new file name
    }

    const updatedLessonPlan = await LessonPlan.findByIdAndUpdate(lessonPlanId, updateData, { new: true, runValidators: true });
    res.status(200).json(updatedLessonPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete Lesson Plan

router.delete('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans/:lessonPlanId', async (req, res) => {
  try {
    const lessonPlan = await LessonPlan.findByIdAndDelete(req.params.lessonPlanId);
    if (!lessonPlan) {
      return res.status(404).json({ error: 'Lesson plan not found' });
    }

    // Delete the file from Cloudinary
    await cloudinary.uploader.destroy(lessonPlan.fileId); // Cloudinary file ID

    res.status(200).json({ message: 'Lesson plan and associated file deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Fetch subjects uploaded by user
router.get('/:sessionId/terms/:termId/subjects/:subjectId/lessonPlans', async (req, res) => {
  try {
    const { sessionId, termId, subjectId } = req.params;

    console.log(`Fetching lesson plans for sessionId: ${sessionId}, termId: ${termId}, subjectId: ${subjectId}`);

    const lessonPlans = await LessonPlan.find({
      sessionId: new mongoose.Types.ObjectId(sessionId),
      termId: new mongoose.Types.ObjectId(termId),
      subjectId: parseInt(subjectId) // Ensure subjectId is numeric
    }).populate('sessionId termId classId comments subjectId', 'name');

    console.log('Lesson Plans:', lessonPlans);

    if (!lessonPlans.length) {
      return res.status(404).json({ error: 'No lesson plans found for the specified criteria' });
    }

    let subject = juniorSubjects.find(sub => sub.id === parseInt(subjectId)) ||
      seniorSubjects.find(sub => sub.id === parseInt(subjectId)) ||
      { name: 'Unknown Subject' };

    const updatedLessonPlans = lessonPlans.map(lessonPlan => {
      const fileUrl = `${req.protocol}://${req.get('host')}/${lessonPlan.file}`;
      return {
        ...lessonPlan.toObject(),
        subjectName: subject.name,
        fileUrl
      };
    });

    res.status(200).json(updatedLessonPlans);
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    res.status(500).json({ error: error.message });
  }
});

// Comment Routes

// Add a comment to a lesson plan
router.post('/:sessionId/terms/:termId/classes/:classId/lessonPlans/:lessonPlanId/comments', async (req, res) => {
  try {
    const { lessonPlanId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const lessonPlan = await LessonPlan.findById(lessonPlanId);

    if (!lessonPlan) {
      return res.status(404).json({ error: 'Lesson Plan not found' });
    }

    const comment = new Comment({ text, lessonPlan: lessonPlanId }); // Set lessonPlan reference here
    await comment.save();

    lessonPlan.comments.push(comment._id);
    await lessonPlan.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Fetch comments for a specific lesson plan
router.get('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans/:lessonPlanId/comments', async (req, res) => {
  try {
    const { lessonPlanId } = req.params;
    const lessonPlan = await LessonPlan.findById(lessonPlanId).populate('comments', 'text'); // Ensure comments are populated with their text
    if (!lessonPlan) {
      return res.status(404).json({ error: 'Lesson plan not found' });
    }

    res.status(200).json(lessonPlan.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Update a comment
router.put('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans/:lessonPlanId/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text, author } = req.body;

    if (!text || !author) {
      return res.status(400).json({ error: 'Text and author are required' });
    }

    const comment = await Comment.findByIdAndUpdate(commentId, { text, author }, { new: true, runValidators: true });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a comment
router.delete('/:sessionId/terms/:termId/classes/:classId/subjects/:subjectId/lessonPlans/:lessonPlanId/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Also remove the comment from the lesson plan's comments array
    await LessonPlan.findByIdAndUpdate(req.params.lessonPlanId, { $pull: { comments: commentId } });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
