const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const { ObjectId } = mongoose.Types;

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Get user from database
    const db = mongoose.connection.db;
    const userCollection = db.collection('User_Registration');
    const user = await userCollection.findOne({ 
      _id: ObjectId.createFromHexString(decoded.userId.toString()) 
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Add user info to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

const requirePatientAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // If user is a patient, they can only access their own data
    if (req.user.role === 'patient') {
      const patientId = req.params.patientId || req.body.patientId;
      
      if (patientId && patientId !== req.user.patientId) {
        return res.status(403).json({ error: 'Access denied to other patient data' });
      }
    }

    next();
  } catch (error) {
    logger.error('Patient access check error:', error);
    return res.status(500).json({ error: 'Access verification failed' });
  }
};

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  authMiddleware,
  requireRole,
  requirePatientAccess,
  generateToken,
  generateRefreshToken
}; 