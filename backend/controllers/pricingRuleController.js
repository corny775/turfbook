const db = require("../config/db");

// Get all pricing rules for one facility
exports.getPricingRules = (req, res) => {
  const { facilityId } = req.params;

  const sql = `
    SELECT *
    FROM pricing_rules
    WHERE facility_id = ?
    ORDER BY rule_type
  `;

  db.query(sql, [facilityId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(results);
  });
};

// Update one pricing rule
exports.updatePricingRule = (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const sql = `
    UPDATE pricing_rules
    SET value = ?
    WHERE id = ?
  `;

  db.query(sql, [value, id], (err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json({
      message: "Pricing rule updated successfully",
    });
  });
};