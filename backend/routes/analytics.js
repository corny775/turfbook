const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const analyticsController = require("../controllers/analyticsController");

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  analyticsController.getAnalytics
);

module.exports = router;