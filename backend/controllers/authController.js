const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);

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

    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr) {
        console.error(compareErr);

        return res.status(500).json({
          message: "Password verification failed",
        });
      }

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      return res.json({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    });
  });
};

exports.signup = (req, res) => {
  const {
    username,
    email,
    contactNumber,
    password,
    adminInviteCode,
  } = req.body;

  if (!username || !email || !contactNumber || !password) {
    return res.status(400).json({
      message:
        "Username, email, contact number and password are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  const checkSql =
    "SELECT id FROM users WHERE username = ? OR email = ?";

  db.query(
    checkSql,
    [username, email],
    (checkErr, existingUsers) => {
      if (checkErr) {
        console.error(checkErr);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (existingUsers.length > 0) {
        return res.status(409).json({
          message: "Username or email is already in use",
        });
      }
      console.log(
  "ADMIN_INVITE_CODE loaded:",
  !!process.env.ADMIN_INVITE_CODE
);
      let role = "customer";

      if (
        adminInviteCode &&
        process.env.ADMIN_INVITE_CODE &&
        adminInviteCode === process.env.ADMIN_INVITE_CODE
      ) {
        role = "admin";
      }

      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error(hashErr);

          return res.status(500).json({
            message: "Failed to secure password",
          });
        }

        const insertSql = `
          INSERT INTO users
          (username, email, contact_number, password, role)
          VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            username,
            email,
            contactNumber,
            hashedPassword,
            role,
          ],
          (insertErr, result) => {
            if (insertErr) {
              console.error(insertErr);

              if (insertErr.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                  message:
                    "Username or email is already in use",
                });
              }

              return res.status(500).json({
                message: "Database error",
              });
            }

            return res.status(201).json({
              id: result.insertId,
              username,
              role,
            });
          }
        );
      });
    }
  );
};