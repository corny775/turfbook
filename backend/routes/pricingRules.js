const express = require("express");
const router = express.Router();

const pricingRuleController = require("../controllers/pricingRuleController");

router.get("/:facilityId", pricingRuleController.getPricingRules);

router.put("/:id", pricingRuleController.updatePricingRule);

module.exports = router;