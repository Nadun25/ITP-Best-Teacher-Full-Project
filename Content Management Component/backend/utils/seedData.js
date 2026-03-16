const mongoose = require('mongoose');
const Material = require('../models/Material');
const User = require('../models/User');
require('dotenv').config();

const teacherId = new mongoose.Types.ObjectId('65f123456789012345678901');

const users = [
  {
    _id: teacherId,
    name: 'Dr. Smith',
    email: 'smith@university.edu',
    role: 'teacher'
  },
  {
    _id: new mongoose.Types.ObjectId('65f123456789012345678902'),
    name: 'John Student',
    email: 'john@student.edu',
    role: 'student'
  }
];

const materials = [
  {
    title: 'Algebra Basics',
    description: 'Learn the fundamentals of Algebra with this comprehensive guide.',
    subject: 'Mathematics',
    grade: 'Grade 10',
    topic: 'Algebra',
    fileUrl: 'uploads/materials/65f123456789012345678901/algebra.pdf',
    fileType: 'application/pdf',
    fileSize: 1048576,
    uploadedBy: teacherId,
  },
  {
    title: 'Chemical Reactions Video',
    description: 'A visual demonstration of common chemical reactions.',
    subject: 'Science',
    grade: 'Grade 11',
    topic: 'Chemistry',
    fileUrl: 'uploads/materials/65f123456789012345678901/chemistry.mp4',
    fileType: 'video/mp4',
    fileSize: 52428800,
    uploadedBy: teacherId,
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/best-teacher');
    console.log('Connected to MongoDB for seeding...');
    
    await User.deleteMany({});
    await User.insertMany(users);
    console.log('Users Seeded!');

    await Material.deleteMany({});
    await Material.insertMany(materials);
    console.log('Materials Seeded!');
    
    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
