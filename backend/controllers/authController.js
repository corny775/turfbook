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
        categoryId: user.category_id,
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
    categoryId,
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

  const checkSql = `
    SELECT id
    FROM users
    WHERE username = ? OR email = ?
  `;

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

      // Default account type
      let role = "customer";
      let assignedCategoryId = null;

      // --------------------------------------------------
      // CUSTOMER SIGNUP
      // --------------------------------------------------

      if (!adminInviteCode) {
        role = "customer";
        assignedCategoryId = null;

        return createUser();
      }

      // --------------------------------------------------
      // ADMIN SIGNUP
      // --------------------------------------------------

      if (!categoryId) {
        return res.status(400).json({
          message: "Category is required for admin signup",
        });
      }

      const inviteSql = `
        SELECT category_id
        FROM category_admin_invites
        WHERE category_id = ?
          AND invite_code = ?
      `;

      db.query(
        inviteSql,
        [categoryId, adminInviteCode],
        (inviteErr, inviteResults) => {
          if (inviteErr) {
            console.error(inviteErr);

            return res.status(500).json({
              message: "Database error",
            });
          }

          if (inviteResults.length === 0) {
            return res.status(403).json({
              message:
                "Invalid admin invite code for the selected category",
            });
          }

          role = "admin";
          assignedCategoryId = inviteResults[0].category_id;

          createUser();
        }
      );


      // --------------------------------------------------
      // CREATE USER
      // --------------------------------------------------

      function createUser() {
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error(hashErr);

            return res.status(500).json({
              message: "Failed to secure password",
            });
          }

          const insertSql = `
            INSERT INTO users
            (
              username,
              email,
              contact_number,
              password,
              role,
              category_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          db.query(
            insertSql,
            [
              username,
              email,
              contactNumber,
              hashedPassword,
              role,
              assignedCategoryId,
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
                categoryId: assignedCategoryId,
              });
            }
          );
        });
      }
    }
  );
};