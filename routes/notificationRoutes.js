const express = require('express');
const notificationController = require('../controllers/notificationController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', ensureAuthenticated, notificationController.getUserNotifications);
router.put('/:id/read', ensureAuthenticated, notificationController.markAsRead);

module.exports = router;
