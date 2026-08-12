const db = require("../config/db");

exports.getAllBookings = (req, res) => {
  const sql = `
    SELECT
      bookings.id,
      bookings.booking_date,
      bookings.start_time,
      bookings.end_time,
      bookings.quantity,
      bookings.amount,
      bookings.status,
      facilities.name AS facility_name,
      facilities.type AS facility_type,
      facilities.pricing_unit,
      users.username
    FROM bookings
    JOIN facilities
      ON bookings.facility_id = facilities.id
    JOIN users
      ON bookings.user_id = users.id
    WHERE facilities.category_id = ?
    ORDER BY
      bookings.booking_date DESC,
      bookings.start_time ASC
  `;

  db.query(
    sql,
    [req.user.categoryId],
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