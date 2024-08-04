const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const lessonPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  filePath: { type: String, required: true },
  comments: [commentSchema]
});

module.exports = mongoose.model('LessonPlan', lessonPlanSchema);
