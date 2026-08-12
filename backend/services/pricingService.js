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

const subtotal = price;

const breakdown = [
  {
    label: "Base price",
    type: "base",
    amount: subtotal,
  },
];

const peakRule = rules.peak;
const weekendRule = rules.weekend;
const discountRule = rules.discount;
const taxRule = rules.tax;

/*
 * Peak Hours
 * 6 PM - 10 PM
 */
if (peakRule && startTime) {
  const hour = Number(startTime.split(":")[0]);

  if (hour >= 18 && hour < 22) {
    const before = price;

    price *= Number(peakRule.value);

    breakdown.push({
      label: "Peak surcharge",
      type: "surcharge",
      amount: Number((price - before).toFixed(2)),
    });
  }
}

/*
 * Weekend
 */
if (weekendRule && date) {
  const day = new Date(date).getDay();

  if (day === 0 || day === 6) {
    const before = price;

    price *= Number(weekendRule.value);

    breakdown.push({
      label: "Weekend surcharge",
      type: "surcharge",
      amount: Number((price - before).toFixed(2)),
    });
  }
}

/*
 * Discount
 */
if (discountRule) {
  const before = price;

  price -=
    price * (Number(discountRule.value) / 100);

  breakdown.push({
    label: "Discount",
    type: "discount",
    amount: Number((price - before).toFixed(2)),
  });
}

/*
 * Tax
 */
if (taxRule) {
  const before = price;

  price +=
    price * (Number(taxRule.value) / 100);

  breakdown.push({
    label: "Tax",
    type: "tax",
    amount: Number((price - before).toFixed(2)),
  });
}

resolve({
  facilityId: facility.id,
  categoryId,
  pricingUnit,
  quantity: requestedQuantity,
  baseRate,

  subtotal: Number(subtotal.toFixed(2)),

  finalPrice: Number(price.toFixed(2)),

  breakdown,

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