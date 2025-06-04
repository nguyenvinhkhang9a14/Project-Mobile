const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};

// Middleware to check if user is doctor
exports.isDoctor = (req, res, next) => {
  if (req.user && (req.user.role === 'doctor' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Doctor privileges required' });
  }
};

// Middleware to check if user is accessing their own data or is admin
exports.isSelfOrAdmin = (req, res, next) => {
  if (
    req.user && 
    (req.user.userId === parseInt(req.params.id) || req.user.role === 'admin')
  ) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: You can only access your own data' });
  }
}; 