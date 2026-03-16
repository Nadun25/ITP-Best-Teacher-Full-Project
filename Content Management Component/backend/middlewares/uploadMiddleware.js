const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Structure: uploads/materials/:teacherId
    const teacherId = req.user ? req.user.id : 'unknown';
    const relativeDir = `uploads/materials/${teacherId}`;
    const absoluteDir = path.join(__dirname, '..', relativeDir);
    
    // Create directory if not exists
    fs.mkdirSync(absoluteDir, { recursive: true });
    
    cb(null, absoluteDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalName
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'video/mp4'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, and MP4 are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

module.exports = upload;
