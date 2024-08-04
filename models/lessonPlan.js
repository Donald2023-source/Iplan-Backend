const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonPlanSchema = new Schema({
  title: { type: String, required: true },
  file: { type: String, required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  termId: { type: Schema.Types.ObjectId, ref: 'Term', required: true },
  classId: { type: Number, required: true },
  subjectId: { type: Number, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('LessonPlan', LessonPlanSchema);
