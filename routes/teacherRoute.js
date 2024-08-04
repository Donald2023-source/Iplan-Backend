const express = require('express');
const multer = require('multer');
const lessonPlanController = require('../controllers/lessonPlanController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination directory for storing uploaded files
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Define the file name for the uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Multer upload instance
const upload = multer({ storage: storage });

// Teacher route for uploading lesson plans with file
router.post('/', ensureAuthenticated, upload.single('lessonPlanFile'), lessonPlanController.uploadLessonPlan);

module.exports = router;
