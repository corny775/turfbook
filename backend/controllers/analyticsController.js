const db = require("../config/db");

exports.getAnalytics = (req, res) => {
  const categoryId = req.user.categoryId;

  const summarySql = `
    SELECT
      COUNT(*) AS totalBookings,
      COALESCE(SUM(CASE WHEN status = 'Booked' THEN amount ELSE 0 END), 0) AS totalRevenue,
      SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelledBookings,
      COALESCE(AVG(CASE WHEN status = 'Booked' THEN amount END), 0) AS averageBookingValue
    FROM bookings
    JOIN facilities
      ON bookings.facility_id = facilities.id
    WHERE facilities.category_id = ?
  `;

  db.query(summarySql, [categoryId], (err, summaryResults) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: err.message,
      });
    }

    const summary = summaryResults[0];

    const totalBookings = Number(summary.totalBookings || 0);
    const cancelledBookings = Number(summary.cancelledBookings || 0);

    const cancellationRate =
      totalBookings > 0
        ? Number(((cancelledBookings / totalBookings) * 100).toFixed(2))
        : 0;

    res.json({
      summary: {
        totalBookings,
        totalRevenue: Number(summary.totalRevenue || 0),
        cancelledBookings,
        cancellationRate,
        averageBookingValue: Number(
          Number(summary.averageBookingValue || 0).toFixed(2)
        ),
      },
    });
  });
};