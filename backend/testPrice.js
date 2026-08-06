const { calculatePrice } = require("./services/pricingService");

(async () => {
  try {
    const result = await calculatePrice(
  1,
  "2026-08-15",
  "19:00",
  1
);

    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();