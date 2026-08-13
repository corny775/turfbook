const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db'); // <-- Add this line
const authRoutes = require("./routes/auth");
const facilityRoutes = require("./routes/facilities");
const bookingRoutes = require("./routes/booking");
const pricingRuleRoutes = require("./routes/pricingRules");
const adminRoutes = require("./routes/admin");
const categoryRoutes = require("./routes/categories");
const analyticsRoutes = require("./routes/analytics");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/pricing-rules", pricingRuleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get('/', (req, res) => {
  res.send('TurfBook Backend is Running!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
