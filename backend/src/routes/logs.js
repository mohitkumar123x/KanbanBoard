const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
 
router.post('/', (req, res) => {
  const { level, message, timestamp } = req.body;
  logger[level](`Frontend: ${message} at ${timestamp}`);
  res.status(200).send('Log received');
});
 
module.exports = router;