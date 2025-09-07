const Subscription = require('../models/Subscription');
const logger = require('../config/logger');

const checkSubscription = async (req, res, next) => {
  const tenantId = req.user.tenantId;
  const subscription = await Subscription.findOne({ tenantId });

  if (!subscription || subscription.plan === 'free' && (await Board.countDocuments({ tenantId })) >= subscription.limit) {
    logger.warn(`Subscription limit reached for tenant ${tenantId}`);
    return res.status(402).json({ error: 'Upgrade your plan to create more boards' });
  }

  next();
};

module.exports = checkSubscription;