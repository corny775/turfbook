module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  if (!req.user.categoryId) {
    return res.status(403).json({
      message: "Admin category is not assigned",
    });
  }

  next();
};