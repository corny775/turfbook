const db = require("../config/db");

exports.login = (req, res) => {
  const { username, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const user = results[0];

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  });
};