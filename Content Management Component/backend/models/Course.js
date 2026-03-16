const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher ID is required'],
  },
  description: {
    type: String,
    trim: true,
  },
  lectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', CourseSchema);
