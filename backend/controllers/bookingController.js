const db = require("../config/db");
const pricingService = require("../services/pricingService");

exports.getBookingsByDate = (req, res) => {
  const { facilityId, date } = req.params;

  const facilitySql = `
    SELECT
      id,
      pricing_unit
    FROM facilities
    WHERE id = ?
  `;

  db.query(
    facilitySql,
    [facilityId],
    (facilityErr, facilityResults) => {
      if (facilityErr) {
        console.error(facilityErr);

        return res.status(500).json({
          message: facilityErr.message,
        });
      }

      if (facilityResults.length === 0) {
        return res.status(404).json({
          message: "Facility not found.",
        });
      }

      const pricingUnit = facilityResults[0].pricing_unit;

      /*
       * HOURLY
       *
       * Return the existing start/end time structure
       * so the current slot picker continues working.
       */
      if (pricingUnit === "hour") {
        const sql = `
          SELECT
            start_time,
            end_time
          FROM bookings
          WHERE facility_id = ?
            AND booking_date = ?
            AND status = 'Booked'
            AND start_time IS NOT NULL
            AND end_time IS NOT NULL
          ORDER BY start_time
        `;

        db.query(
          sql,
          [facilityId, date],
          (err, results) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: err.message,
              });
            }

            return res.json({
              pricingUnit,
              bookings: results,
            });
          }
        );

        return;
      }

      /*
       * NIGHT / DAY
       *
       * Return bookings that occupy the requested date.
       */
      if (pricingUnit === "night" || pricingUnit === "day") {
        const sql = `
          SELECT
            id,
            booking_date,
            quantity
          FROM bookings
          WHERE facility_id = ?
            AND status = 'Booked'
            AND booking_date < DATE_ADD(?, INTERVAL quantity DAY)
            AND DATE_ADD(booking_date, INTERVAL quantity DAY) > ?
          ORDER BY booking_date
        `;

        db.query(
          sql,
          [facilityId, date, date],
          (err, results) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: err.message,
              });
            }

            return res.json({
              pricingUnit,
              bookings: results,
            });
          }
        );

        return;
      }

      /*
       * EVENT / PERSON / SESSION / ITEM
       *
       * Return bookings made on the requested date.
       */
      const sql = `
        SELECT
          id,
          booking_date,
          quantity
        FROM bookings
        WHERE facility_id = ?
          AND booking_date = ?
          AND status = 'Booked'
        ORDER BY id
      `;

      db.query(
        sql,
        [facilityId, date],
        (err, results) => {
          if (err) {
            console.error(err);

            return res.status(500).json({
              message: err.message,
            });
          }

          return res.json({
            pricingUnit,
            bookings: results,
          });
        }
      );
    }
  );
};

exports.checkAvailability = (req, res) => {
  const { facilityId, startDate, quantity } = req.query;

  if (!facilityId || !startDate || !quantity) {
    return res.status(400).json({
      message: "facilityId, startDate and quantity are required.",
    });
  }

  const requestedQuantity = Number(quantity);

  if (
    !Number.isInteger(requestedQuantity) ||
    requestedQuantity <= 0
  ) {
    return res.status(400).json({
      message: "Quantity must be a positive integer.",
    });
  }

  const sql = `
    SELECT id, booking_date, quantity
    FROM bookings
    WHERE facility_id = ?
      AND status = 'Booked'
      AND booking_date < DATE_ADD(?, INTERVAL ? DAY)
      AND DATE_ADD(booking_date, INTERVAL quantity DAY) > ?
  `;

  db.query(
    sql,
    [
      facilityId,
      startDate,
      requestedQuantity,
      startDate,
    ],
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        available: results.length === 0,
        bookings: results,
      });
    }
  );
};

exports.createBooking = (req, res) => {
  const {
    user_id,
    facility_id,
    booking_date,
    start_time,
    end_time,
    quantity = 1,
  } = req.body;

  if (!user_id || !facility_id || !booking_date) {
    return res.status(400).json({
      message: "Missing required booking information.",
    });
  }

  const requestedQuantity = Number(quantity);

  if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
    return res.status(400).json({
      message: "Quantity must be a positive integer.",
    });
  }

  const facilitySql = `
    SELECT
      id,
      pricing_unit
    FROM facilities
    WHERE id = ?
  `;

  db.query(facilitySql, [facility_id], async (err, facilityResults) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: err.message,
      });
    }

    if (facilityResults.length === 0) {
      return res.status(404).json({
        message: "Facility not found.",
      });
    }

    const facility = facilityResults[0];
    const pricingUnit = facility.pricing_unit;

    const today = new Date().toISOString().split("T")[0];

    if (booking_date < today) {
      return res.status(400).json({
        message: "Cannot book a past date.",
      });
    }

    // Hourly facilities require a start and end time.
    if (pricingUnit === "hour") {
      if (!start_time || !end_time) {
        return res.status(400).json({
          message: "Start time and end time are required for hourly bookings.",
        });
      }

      if (end_time <= start_time) {
        return res.status(400).json({
          message: "Invalid booking time.",
        });
      }
    }

    // Calculate the price on the server.
    // Never trust the amount sent by the frontend.
    let calculatedPrice;

    try {
      const priceResult = await pricingService.calculatePrice(
        facility_id,
        booking_date,
        start_time || null,
        requestedQuantity
      );

      calculatedPrice = priceResult.finalPrice;
    } catch (priceError) {
      console.error(priceError);

      return res.status(500).json({
        message: priceError.message,
      });
    }

    /*
     * HOURLY
     *
     * Prevent overlapping time slots.
     */
    if (pricingUnit === "hour") {
      const overlapSql = `
        SELECT id
        FROM bookings
        WHERE facility_id = ?
          AND booking_date = ?
          AND status = 'Booked'
          AND start_time < ?
          AND end_time > ?
      `;

      db.query(
        overlapSql,
        [facility_id, booking_date, end_time, start_time],
        (err, overlapResults) => {
          if (err) {
            console.error(err);

            return res.status(500).json({
              message: err.message,
            });
          }

          if (overlapResults.length > 0) {
            return res.status(409).json({
              message: "This slot is already booked.",
            });
          }

          insertBooking(
            user_id,
            facility_id,
            booking_date,
            start_time,
            end_time,
            requestedQuantity,
            calculatedPrice,
            res
          );
        }
      );

      return;
    }

    /*
     * NIGHT / DAY
     *
     * These occupy a range of dates.
     *
     * Example:
     * 15 Aug + 3 nights
     * occupies 15, 16 and 17 Aug.
     */
    if (pricingUnit === "night" || pricingUnit === "day") {
      const overlapSql = `
        SELECT id
        FROM bookings
        WHERE facility_id = ?
          AND status = 'Booked'
          AND booking_date < DATE_ADD(?, INTERVAL ? DAY)
          AND DATE_ADD(booking_date, INTERVAL quantity DAY) > ?
      `;

      db.query(
        overlapSql,
        [
          facility_id,
          booking_date,
          requestedQuantity,
          booking_date,
        ],
        (err, overlapResults) => {
          if (err) {
            console.error(err);

            return res.status(500).json({
              message: err.message,
            });
          }

          if (overlapResults.length > 0) {
            return res.status(409).json({
              message: "This facility is already booked for part of those dates.",
            });
          }

          insertBooking(
            user_id,
            facility_id,
            booking_date,
            null,
            null,
            requestedQuantity,
            calculatedPrice,
            res
          );
        }
      );

      return;
    }

    /*
     * EVENT / PERSON / SESSION / ITEM
     *
     * These are date-based bookings.
     * Only one active booking for the facility on that date.
     */
    const dateBookingSql = `
      SELECT id
      FROM bookings
      WHERE facility_id = ?
        AND booking_date = ?
        AND status = 'Booked'
    `;

    db.query(
      dateBookingSql,
      [facility_id, booking_date],
      (err, existingBookings) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: err.message,
          });
        }

        if (existingBookings.length > 0) {
          return res.status(409).json({
            message: "This facility is already booked on that date.",
          });
        }

        insertBooking(
          user_id,
          facility_id,
          booking_date,
          null,
          null,
          requestedQuantity,
          calculatedPrice,
          res
        );
      }
    );
  });
};


/*
 * Insert a validated booking.
 */
function insertBooking(
  userId,
  facilityId,
  bookingDate,
  startTime,
  endTime,
  quantity,
  amount,
  res
) {
  const sql = `
    INSERT INTO bookings
    (
      user_id,
      facility_id,
      booking_date,
      start_time,
      end_time,
      quantity,
      amount,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Booked')
  `;

  db.query(
    sql,
    [
      userId,
      facilityId,
      bookingDate,
      startTime,
      endTime,
      quantity,
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
        amount,
        quantity,
      });
    }
  );
}

exports.getUserBookings = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT
      bookings.id,
      facilities.name AS facility_name,
      facilities.type AS facility_type,
      facilities.pricing_unit,
      bookings.booking_date,
      bookings.start_time,
      bookings.end_time,
      bookings.quantity,
      bookings.amount,
      bookings.status
    FROM bookings
    JOIN facilities
      ON bookings.facility_id = facilities.id
    WHERE bookings.user_id = ?
    ORDER BY
      bookings.booking_date DESC,
      bookings.start_time ASC,
      bookings.id DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);

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
    quantity,
  } = req.body;

  try {
    const result = await pricingService.calculatePrice(
      facilityId,
      date,
      startTime,
      quantity
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.cancelBooking = (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: "User ID is required.",
    });
  }

  const sql = `
    UPDATE bookings
    SET status = 'Cancelled'
    WHERE id = ?
      AND user_id = ?
      AND status = 'Booked'
      AND (
        start_time IS NULL
        OR TIMESTAMP(booking_date, start_time) > NOW()
      )
  `;

  db.query(sql, [id, user_id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message:
          "Booking cannot be cancelled. It may not belong to you, may already be cancelled, or may have already started.",
      });
    }

    res.json({
      message: "Booking cancelled successfully.",
    });
  });
};