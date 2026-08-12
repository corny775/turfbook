const db = require("../config/db");

exports.getCategories = (req, res) => {
  const sql = `
    SELECT
      id,
      name,
      description,
      icon
    FROM categories
    ORDER BY id ASC
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