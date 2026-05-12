const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'architect_pos_secret_key_2024';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== 'Admin' && role !== 'Owner') {
    return res.status(403).json({ status: 'error', message: 'Require admin privileges' });
  }
  return next();
};

module.exports = { authenticate, requireAdmin };
