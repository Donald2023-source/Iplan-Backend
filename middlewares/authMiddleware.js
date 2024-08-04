const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleWare = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization token is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'me@dev123');
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      throw new Error('Not authorized as admin');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};

module.exports = authMiddleWare;
