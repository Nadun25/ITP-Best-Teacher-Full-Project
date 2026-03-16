/**
 * Authentication and Authorization Middleware
 * Note: This is an implementation assuming an existing Auth system.
 * It expects a valid JWT in the Authorization header.
 */

const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  // For development/university project demo purposes:
  if (token === 'mock-teacher-token') {
    req.user = { id: '65f123456789012345678901', role: 'teacher' };
    return next();
  }
  if (token === 'mock-student-token') {
    req.user = { id: '65f123456789012345678902', role: 'student' };
    return next();
  }

  try {
    // In a real app, use process.env.JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorizeTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Teacher role required' });
  }
};

module.exports = {
  authenticateUser,
  authorizeTeacher,
};
