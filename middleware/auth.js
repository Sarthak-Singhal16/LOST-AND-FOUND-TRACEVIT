// middleware/auth.js
module.exports = function(req, res, next) {
  // Check if the user is authenticated via session (e.g., Passport)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({ error: 'Unauthorized. Please log in.' });
};
