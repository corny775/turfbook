const express = require("express");
const router = express.Router();

const facilityController = require("../controllers/facilityController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// ------------------------------------------------------------
// Viewing facilities
// Customer → all facilities
// Admin    → own category
// ------------------------------------------------------------

router.get(
  "/",
  authMiddleware,
  facilityController.getFacilities
);

router.get(
  "/:id",
  authMiddleware,
  facilityController.getFacilityById
);


// ------------------------------------------------------------
// Managing facilities
// Admin only
// ------------------------------------------------------------

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  facilityController.createFacility
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  facilityController.updateFacility
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  facilityController.deleteFacility
);


module.exports = router;