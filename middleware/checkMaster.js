// middleware/checkMaster.js
module.exports = function(req, res, next) {
    if (req.user && req.user.role === 'master') {
      next();
    } else {
      return res.status(403).json({ error: 'Access denied. Master role required.' });
    }
  };
  