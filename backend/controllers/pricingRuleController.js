const db = require("../config/db");

// Get pricing rules for one facility
exports.getPricingRules = (req, res) => {
  const { facilityId } = req.params;
  const categoryId = req.user.categoryId;

  const sql = `
    SELECT
      pr.id,
      pr.category_id,
      pr.facility_id,
      pr.rule_type,
      pr.value
    FROM pricing_rules pr
    JOIN facilities f
      ON f.id = ?
    WHERE
      f.category_id = ?
      AND (
        (
          pr.facility_id IS NULL
          AND pr.category_id = ?
        )
        OR
        (
          pr.facility_id = ?
          AND pr.category_id = ?
        )
      )
    ORDER BY pr.rule_type
  `;

  db.query(
    sql,
    [
      facilityId,
      categoryId,
      categoryId,
      facilityId,
      categoryId
    ],
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: err.message,
        });
      }

      res.json(results);
    }
  );
};


// Update one pricing rule
exports.updatePricingRule = (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const categoryId = req.user.categoryId;

  const sql = `
    UPDATE pricing_rules pr
    LEFT JOIN facilities f
      ON pr.facility_id = f.id
    SET pr.value = ?
    WHERE pr.id = ?
      AND (
        pr.category_id = ?
        OR f.category_id = ?
      )
  `;

  db.query(
    sql,
    [value, id, categoryId, categoryId],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Pricing rule not found or does not belong to your category",
        });
      }

      res.json({
        message: "Pricing rule updated successfully",
      });
    }
  );
};