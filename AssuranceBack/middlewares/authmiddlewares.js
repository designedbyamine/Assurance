const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify the user's token and authenticate them
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Accès non autorisé, veuillez vous connecter.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    req.user = user;  // Attach user to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

// Middleware to check if the user is a Client
const clientMiddleware = (req, res, next) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ message: 'Accès réservé aux clients.' });
  }
  next();
};

// Middleware to check if the user is an Expert
const expertMiddleware = (req, res, next) => {
  if (req.user.role !== 'expert' || req.user.status === 'Pending') {
    return res.status(403).json({ message: 'Accès réservé aux experts actifs.' });
  }
  next();
};

// Middleware to check if the user is an Admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  }
  next();
};

module.exports = { 
  authMiddleware, 
  clientMiddleware, 
  expertMiddleware, 
  adminMiddleware 
};
