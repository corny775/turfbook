const db = require("../config/db");

exports.getFacilities = (req, res) => {
  const sql = "SELECT * FROM facilities";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
};

exports.getFacilityById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM facilities WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
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

exports.createFacility = (req, res) => {
  const {
    name,
    type,
    base_rate,
    slot_duration,
  } = req.body;

  const sql = `
    INSERT INTO facilities
    (name, type, base_rate, slot_duration)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, type, base_rate, slot_duration],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Facility created successfully",
        id: result.insertId,
      });
    }
  );
};

exports.updateFacility = (req, res) => {
  const { id } = req.params;

  const {
    name,
    type,
    base_rate,
    slot_duration,
  } = req.body;

  const sql = `
    UPDATE facilities
    SET
      name = ?,
      type = ?,
      base_rate = ?,
      slot_duration = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      type,
      base_rate,
      slot_duration,
      id,
    ],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Facility updated successfully",
      });
    }
  );
};

exports.deleteFacility = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM facilities WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message,
      });
    }

    res.json({
      message: "Facility deleted successfully",
    });
  });
};