const roleCheckMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userDetails || !req.userDetails.role) {
      return res.status(401).json({
        success: false,
        message: 'User information not found. Please login.',
      });
    }

    if (!allowedRoles.includes(req.userDetails.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = roleCheckMiddleware;
