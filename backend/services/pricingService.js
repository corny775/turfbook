const db = require("../config/db");

async function calculatePrice(
  facilityId,
  date,
  startTime,
  quantity = 1
) {
  return new Promise((resolve, reject) => {
    const facilitySql = `
      SELECT
        id,
        category_id,
        base_rate,
        pricing_unit
      FROM facilities
      WHERE id = ?
    `;

    db.query(facilitySql, [facilityId], (err, facilityResults) => {
      if (err) {
        return reject(err);
      }

      if (facilityResults.length === 0) {
        return reject(new Error("Facility not found"));
      }

      const facility = facilityResults[0];

      const baseRate = Number(facility.base_rate);
      const categoryId = facility.category_id;
      const pricingUnit = facility.pricing_unit;
      const requestedQuantity = Number(quantity);

      if (!requestedQuantity || requestedQuantity <= 0) {
        return reject(new Error("Quantity must be greater than 0"));
      }

      /*
       * Get category rules and facility-specific rules.
       *
       * Category rules are defaults.
       * Facility rules override category rules
       * when the same rule_type exists.
       */
      const ruleSql = `
        SELECT
          id,
          rule_type,
          value,
          category_id,
          facility_id
        FROM pricing_rules
        WHERE category_id = ?
           OR facility_id = ?
        ORDER BY
          CASE
            WHEN facility_id IS NOT NULL THEN 1
            ELSE 0
          END ASC
      `;

      db.query(
        ruleSql,
        [categoryId, facilityId],
        (err, ruleResults) => {
          if (err) {
            return reject(err);
          }

          /*
           * Category rules are defaults.
           * Facility rules override them.
           */
          const rules = {};

          ruleResults.forEach((rule) => {
            rules[rule.rule_type] = rule;
          });

          let price = baseRate * requestedQuantity;

          const peakRule = rules.peak;
          const weekendRule = rules.weekend;
          const discountRule = rules.discount;
          const taxRule = rules.tax;

          /*
           * Peak Hours
           * 6 PM - 10 PM
           *
           * Peak value is a multiplier.
           * Example: 1.50 = +50%
           */
          if (peakRule && startTime) {
            const hour = Number(startTime.split(":")[0]);

            if (hour >= 18 && hour < 22) {
              price *= Number(peakRule.value);
            }
          }

          /*
           * Weekend
           *
           * Weekend value is also a multiplier.
           * Example: 1.20 = +20%
           */
          if (weekendRule && date) {
            const day = new Date(date).getDay();

            if (day === 0 || day === 6) {
              price *= Number(weekendRule.value);
            }
          }

          /*
           * Discount
           *
           * Example: 10 = 10% discount
           */
          if (discountRule) {
            price -=
              price * (Number(discountRule.value) / 100);
          }

          /*
           * Tax
           *
           * Example: 18 = 18% tax
           */
          if (taxRule) {
            price +=
              price * (Number(taxRule.value) / 100);
          }

          resolve({
            facilityId: facility.id,
            categoryId,
            pricingUnit,
            quantity: requestedQuantity,
            baseRate,
            subtotal: Number(
              (baseRate * requestedQuantity).toFixed(2)
            ),
            finalPrice: Number(price.toFixed(2)),
            rules: Object.values(rules),
          });
        }
      );
    });
  });
}

module.exports = {
  calculatePrice,
};