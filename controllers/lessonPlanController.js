const LessonPlan = require('../models/lessonPlan')

exports.createLessonPlan = async (req, res) => {
  try {
    const { title, description } = req.body;
    const lessonPlan = new LessonPlan({ title, description });
    await lessonPlan.save();
    res.status(201).json(lessonPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllLessonPlans = async (req, res) => {
  try {
    const lessonPlans = await LessonPlan.find();
    res.status(200).json(lessonPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLessonPlanById = async (req, res) => {
  try {
    const lessonPlan = await LessonPlan.findById(req.params.id);
    if (!lessonPlan) {
      return res.status(404).json({ message: 'Lesson plan not found' });
    }
    res.status(200).json(lessonPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.commentOnLessonPlan = async (req, res) => {
  try {
    const { comment } = req.body;
    const lessonPlan = await LessonPlan.findById(req.params.id);
    if (!lessonPlan) {
      return res.status(404).json({ message: 'Lesson plan not found' });
    }
    lessonPlan.comments.push({ text: comment, createdBy: req.user.id });
    await lessonPlan.save();
    res.status(201).json(lessonPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
