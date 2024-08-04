const express = require('express');
const adminController = require('../controllers/adminController');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/term', ensureAuthenticated, ensureAdmin, adminController.createTerm);
router.get('/terms', ensureAuthenticated, ensureAdmin, adminController.getAllTerms);
module.exports = router;
