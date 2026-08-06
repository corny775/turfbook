const db = require("../config/db");

async function calculatePrice(facilityId, date, startTime, duration) {
  return new Promise((resolve, reject) => {

    const facilitySql =
      "SELECT base_rate FROM facilities WHERE id = ?";

    db.query(facilitySql, [facilityId], (err, facilityResults) => {

      if (err) {
        return reject(err);
      }

      if (facilityResults.length === 0) {
        return reject(new Error("Facility not found"));
      }

      const baseRate = Number(facilityResults[0].base_rate);

      const ruleSql = `
        SELECT rule_type, value
        FROM pricing_rules
        WHERE facility_id = ?
      `;

      db.query(ruleSql, [facilityId], (err, ruleResults) => {

        if (err) {
          return reject(err);
        }

        let price = baseRate * duration;

const peakRule = ruleResults.find(
  (rule) => rule.rule_type === "peak"
);

const weekendRule = ruleResults.find(
  (rule) => rule.rule_type === "weekend"
);

const discountRule = ruleResults.find(
  (rule) => rule.rule_type === "discount"
);

const taxRule = ruleResults.find(
  (rule) => rule.rule_type === "tax"
);

// Peak Hours (6 PM - 10 PM)
const hour = Number(startTime.split(":")[0]);

if (peakRule && hour >= 18 && hour < 22) {
  price *= Number(peakRule.value);
}

// Weekend
const day = new Date(date).getDay();

if (weekendRule && (day === 0 || day === 6)) {
  price *= Number(weekendRule.value);
}

// Discount
if (discountRule) {
  price -= price * (Number(discountRule.value) / 100);
}

// Tax
if (taxRule) {
  price += price * (Number(taxRule.value) / 100);
}

resolve({
  baseRate,
  finalPrice: Number(price.toFixed(2)),
  rules: ruleResults,
});

      });

    });

  });
}

module.exports = {
  calculatePrice,
};