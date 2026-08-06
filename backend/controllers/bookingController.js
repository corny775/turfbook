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

  const sql = `
    INSERT INTO bookings
    (user_id, facility_id, booking_date, start_time, end_time, amount, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Booked')
  `;

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
        console.log(err);
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