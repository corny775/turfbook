const express = require("express");
const router = express.Router();

const pricingRuleController = require("../controllers/pricingRuleController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
  "/:facilityId",
  authMiddleware,
  adminMiddleware,
  pricingRuleController.getPricingRules
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  pricingRuleController.updatePricingRule
);

module.exports = router;