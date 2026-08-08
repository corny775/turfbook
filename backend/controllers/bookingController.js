const db = require("../config/db");
const pricingService = require("../services/pricingService");

exports.getBookingsByDate = (req, res) => {
  const { facilityId, date } = req.params;

  const sql = `
    SELECT start_time, end_time
    FROM bookings
    WHERE facility_id = ? AND booking_date = ? AND status = 'Booked'
  `;

  db.query(sql, [facilityId, date], (err, results) => {
    if (err) {
  console.log(err);
  return res.status(500).json({
    message: err.message,
  });
}

    res.json(results);
  });
};

exports.createBooking = (req, res) => {
  const {
    user_id,
    facility_id,
    booking_date,
    start_time,
    end_time,
    amount,
  } = req.body;

  const facilitySql = `
  SELECT id
  FROM facilities
  WHERE id = ?
`;

  const sql = `
    INSERT INTO bookings
    (user_id, facility_id, booking_date, start_time, end_time, amount, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Booked')
  `;

  db.query(facilitySql, [facility_id], (err, results) => {

  if (err) {
    return res.status(500).json({
      message: err.message,
    });
  }

  if (results.length === 0) {
    return res.status(404).json({
      message: "Facility not found",
    });
  }
  const today = new Date().toISOString().split("T")[0];

  if (booking_date < today) {
    return res.status(400).json({
      message: "Cannot book a past date.",
    });
  }

  if (end_time <= start_time) {
  return res.status(400).json({
    message: "Invalid booking time.",
  });
}

const overlapSql = `
  SELECT id
  FROM bookings
  WHERE facility_id = ?
    AND booking_date = ?
    AND status = 'Booked'
    AND start_time < ?
    AND end_time > ?
`;

  // Existing INSERT query goes here

  db.query(
  overlapSql,
  [facility_id, booking_date, end_time, start_time],
  (err, overlapResults) => {

    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (overlapResults.length > 0) {
      return res.status(409).json({
        message: "This slot is already booked.",
      });
    }

    // No overlap, create booking
    db.query(
      sql,
      [
        user_id,
        facility_id,
        booking_date,
        start_time,
        end_time,
        amount,
      ],
      (err, result) => {

        if (err) {
          console.error(err);

          return res.status(500).json({
            message: err.message,
          });
        }

        res.json({
          message: "Booking successful",
          bookingId: result.insertId,
        });

      }
    );

  }
);

});
};

exports.getUserBookings = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT
      bookings.id,
      facilities.name AS facility_name,
      booking_date,
      start_time,
      end_time,
      amount,
      status
    FROM bookings
    JOIN facilities
      ON bookings.facility_id = facilities.id
    WHERE user_id = ?
    ORDER BY booking_date DESC, start_time ASC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(results);
  });
};

exports.calculateBookingPrice = async (req, res) => {
  const {
    facilityId,
    date,
    startTime,
    duration,
  } = req.body;

  try {
    const result = await pricingService.calculatePrice(
      facilityId,
      date,
      startTime,
      duration
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};