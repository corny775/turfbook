const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

router.get(
  "/user/:userId",
  bookingController.getUserBookings
);

router.get(
  "/:facilityId/:date",
  bookingController.getBookingsByDate
);

router.post(
  "/calculate",
  bookingController.calculateBookingPrice
);

router.post(
  "/",
  bookingController.createBooking
);

module.exports = router;