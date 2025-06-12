const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
  
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

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};

exports.isDoctor = (req, res, next) => {
  if (req.user && (req.user.role === 'doctor' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Doctor privileges required' });
  }
};

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