const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
  lectureTitle: {
    type: String,
    required: [true, 'Lecture title is required'],
    trim: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required'],
  },
  materials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lecture', LectureSchema);
