const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    index: true,
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    index: true,
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    index: true,
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  },
  fileType: {
    type: String,
    required: [true, 'File Type is required'],
  },
  fileSize: {
    type: Number, // in bytes
    required: [true, 'File Size is required'],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader ID is required'],
    index: true,
  },
  thumbnail: {
    type: String,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Material', MaterialSchema);
