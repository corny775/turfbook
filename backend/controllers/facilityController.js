const db = require("../config/db");

// GET all facilities
exports.getFacilities = (req, res) => {
  const sql = `
    SELECT
      f.id,
      f.category_id,
      f.name,
      f.type,
      f.description,
      f.base_rate,
      f.pricing_unit,
      c.name AS category_name
    FROM facilities f
    JOIN categories c
      ON f.category_id = c.id
    ORDER BY f.category_id ASC, f.id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
};


// GET facility by ID
exports.getFacilityById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      f.id,
      f.category_id,
      f.name,
      f.type,
      f.description,
      f.base_rate,
      f.pricing_unit,
      c.name AS category_name
    FROM facilities f
    JOIN categories c
      ON f.category_id = c.id
    WHERE f.id = ?
  `;

  db.query(sql, [id], (err, results) => {
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


// CREATE facility
exports.createFacility = (req, res) => {
  const {
    category_id,
    name,
    type,
    description,
    base_rate,
    pricing_unit,
  } = req.body;

  if (
    !category_id ||
    !name ||
    !type ||
    base_rate === undefined ||
    !pricing_unit
  ) {
    return res.status(400).json({
      message:
        "Category, name, type, base rate and pricing unit are required",
    });
  }

  // Make sure the category exists
  const categorySql = `
    SELECT id
    FROM categories
    WHERE id = ?
  `;

  db.query(categorySql, [category_id], (categoryErr, categories) => {
    if (categoryErr) {
      console.error(categoryErr);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (categories.length === 0) {
      return res.status(400).json({
        message: "Invalid category",
      });
    }

    const sql = `
      INSERT INTO facilities
      (
        category_id,
        name,
        type,
        description,
        base_rate,
        pricing_unit
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        category_id,
        name,
        type,
        description || null,
        base_rate,
        pricing_unit,
      ],
      (err, result) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: err.message,
          });
        }

        res.status(201).json({
          message: "Facility created successfully",
          id: result.insertId,
        });
      }
    );
  });
};


// UPDATE facility
exports.updateFacility = (req, res) => {
  const { id } = req.params;

  const {
    category_id,
    name,
    type,
    description,
    base_rate,
    pricing_unit,
  } = req.body;

  if (
    !category_id ||
    !name ||
    !type ||
    base_rate === undefined ||
    !pricing_unit
  ) {
    return res.status(400).json({
      message:
        "Category, name, type, base rate and pricing unit are required",
    });
  }

  const sql = `
    UPDATE facilities
    SET
      category_id = ?,
      name = ?,
      type = ?,
      description = ?,
      base_rate = ?,
      pricing_unit = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      category_id,
      name,
      type,
      description || null,
      base_rate,
      pricing_unit,
      id,
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
          message: "Facility not found",
        });
      }

      res.json({
        message: "Facility updated successfully",
      });
    }
  );
};


// DELETE facility
exports.deleteFacility = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM facilities
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Facility not found",
      });
    }

    res.json({
      message: "Facility deleted successfully",
    });
  });
};