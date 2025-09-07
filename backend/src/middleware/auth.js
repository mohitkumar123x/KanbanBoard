const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    logger.error('No token provided');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Invalid token: ${error.message}`);
    res.status(401).json({ error: 'Invalid token' });
  }
};


//tenant
// const auth = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return res.status(401).json({ error: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { userId, tenantId, role }
//     logger.info(`Authenticated user ${decoded.userId} with role ${decoded.role}`);
//     next();
//   } catch (error) {
//     logger.error(`Authentication failed: ${error.message}`);
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// module.exports = auth;