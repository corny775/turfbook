const db = require("../config/db");

exports.getAllBookings = (req, res) => {
  const sql = `
    SELECT
      bookings.id,
      bookings.booking_date,
      bookings.start_time,
      bookings.end_time,
      bookings.amount,
      bookings.status,
      facilities.name AS facility_name,
      users.username
    FROM bookings
    JOIN facilities
      ON bookings.facility_id = facilities.id
    JOIN users
      ON bookings.user_id = users.id
    ORDER BY booking_date DESC, start_time ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(results);
  });
};