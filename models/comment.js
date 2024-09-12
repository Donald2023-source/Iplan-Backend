
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  lessonPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'LessonPlan' }
});

module.exports = mongoose.model('Comment', commentSchema); 
