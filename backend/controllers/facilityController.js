const db = require("../config/db");


// ============================================================
// GET ALL FACILITIES
// Customer → sees all facilities
// Admin    → sees only facilities in their category
// ============================================================

exports.getFacilities = (req, res) => {
  let sql;
  let params = [];

  if (req.user.role === "admin") {
    sql = `
      SELECT *
      FROM facilities
      WHERE category_id = ?
    `;

    params = [req.user.categoryId];
  } else {
    sql = `
      SELECT *
      FROM facilities
    `;
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
};


// ============================================================
// GET SINGLE FACILITY
// Customer → can view any facility
// Admin    → can only view their category
// ============================================================

exports.getFacilityById = (req, res) => {
  const { id } = req.params;

  let sql;
  let params;

  if (req.user.role === "admin") {
    sql = `
      SELECT *
      FROM facilities
      WHERE id = ?
        AND category_id = ?
    `;

    params = [id, req.user.categoryId];
  } else {
    sql = `
      SELECT *
      FROM facilities
      WHERE id = ?
    `;

    params = [id];
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Facility not found",
      });
    }

    res.json(results[0]);
  });
};


// ============================================================
// CREATE FACILITY
// Admin only
// Facility automatically belongs to admin's category
// ============================================================

exports.createFacility = (req, res) => {
  const {
    name,
    type,
    base_rate,
    pricing_unit,
    capacity,
  } = req.body;

  const categoryId = req.user.categoryId;

  const sql = `
    INSERT INTO facilities
    (
      category_id,
      name,
      type,
      base_rate,
      pricing_unit,
      capacity
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      categoryId,
      name,
      type,
      base_rate,
      pricing_unit,
      capacity,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: err.message,
        });
      }

      const facilityId = result.insertId;

      const pricingSql = `
        INSERT INTO pricing_rules
        (
          facility_id,
          rule_type,
          value
        )
        VALUES
          (?, 'peak', 1.00),
          (?, 'weekend', 1.00),
          (?, 'discount', 0),
          (?, 'tax', 18)
      `;

      db.query(
        pricingSql,
        [
          facilityId,
          facilityId,
          facilityId,
          facilityId,
        ],
        (pricingErr) => {
          if (pricingErr) {
            console.error(pricingErr);

            return res.status(500).json({
              message:
                "Facility created, but default pricing rules could not be created.",
            });
          }

          res.status(201).json({
            message: "Facility created successfully",
            id: facilityId,
            categoryId,
          });
        }
      );
    }
  );
};


// ============================================================
// UPDATE FACILITY
// Admin can only update their category
// ============================================================

exports.updateFacility = (req, res) => {
  const { id } = req.params;

  const {
    name,
    type,
    base_rate,
    pricing_unit,
    capacity,
  } = req.body;

  const sql = `
    UPDATE facilities
    SET
      name = ?,
      type = ?,
      base_rate = ?,
      pricing_unit = ?,
      capacity = ?
    WHERE id = ?
      AND category_id = ?
  `;

  db.query(
    sql,
    [
      name,
      type,
      base_rate,
      pricing_unit,
      capacity,
      id,
      req.user.categoryId,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Facility not found or does not belong to your category",
        });
      }

      res.json({
        message: "Facility updated successfully",
      });
    }
  );
};


// ============================================================
// DELETE FACILITY
// Admin can only delete their category
// ============================================================

exports.deleteFacility = (req, res) => {
  const { id } = req.params;

  const checkSql = `
    SELECT id
    FROM facilities
    WHERE id = ?
      AND category_id = ?
  `;

  db.query(
    checkSql,
    [id, req.user.categoryId],
    (checkErr, results) => {
      if (checkErr) {
        console.error(checkErr);

        return res.status(500).json({
          message: checkErr.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message:
            "Facility not found or does not belong to your category",
        });
      }

      const deletePricingSql = `
        DELETE FROM pricing_rules
        WHERE facility_id = ?
      `;

      db.query(
        deletePricingSql,
        [id],
        (pricingErr) => {
          if (pricingErr) {
            console.error(pricingErr);

            return res.status(500).json({
              message: pricingErr.message,
            });
          }

          const deleteFacilitySql = `
            DELETE FROM facilities
            WHERE id = ?
              AND category_id = ?
          `;

          db.query(
            deleteFacilitySql,
            [
              id,
              req.user.categoryId,
            ],
            (facilityErr) => {
              if (facilityErr) {
                console.error(facilityErr);

                return res.status(500).json({
                  message: facilityErr.message,
                });
              }

              res.json({
                message: "Facility deleted successfully",
              });
            }
          );
        }
      );
    }
  );
};