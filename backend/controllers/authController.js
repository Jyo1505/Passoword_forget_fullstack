const db = require("../config/db");
const bcrypt = require("bcrypt");

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
const strongPasswordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;


if (!strongPasswordRegex.test(password)) {
  return res.json({
    success: false,
    message:
      "Password must be at least 8 characters and include letters, numbers, and special characters"
  });
}

  if (!email || !password || !confirmPassword) {
    return res.json({ success: false, message: "All fields required" });
  }

  if (password !== confirmPassword) {
    return res.json({ success: false, message: "Passwords do not match" });
  }

  const cleanEmail = email.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "SELECT id FROM users WHERE email = ?",
    [cleanEmail],
    (err, result) => {
      if (err) return res.json({ success: false, message: "Server error" });

      if (result.length > 0) {
        return res.json({ success: false, message: "User already exists" });
      }

      db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [cleanEmail, hashedPassword],
        () => {
          res.json({ success: true, message: "Registration successful" });
        }
      );
    }
  );
};

/* =========================
   LOGIN
========================= */
exports.login = (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email.toLowerCase().trim();

  db.query(
    "SELECT password FROM users WHERE email = ? LIMIT 1",
    [cleanEmail],
    async (err, result) => {
      if (err) return res.json({ success: false, message: "Server error" });

      if (result.length === 0) {
        return res.json({ success: false, message: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, result[0].password);

      if (!match) {
        return res.json({ success: false, message: "Invalid credentials" });
      }

      res.json({ success: true, message: "Login successful" });
    }
  );
};

/* =========================
   FORGOT PASSWORD
   (once per day)
========================= */
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  const cleanEmail = email.toLowerCase().trim();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  db.query(
    "SELECT id, last_forgot_request FROM users WHERE email = ?",
    [cleanEmail],
    (err, result) => {
      if (err) return res.json({ success: false, message: "Server error" });

      if (result.length === 0) {
        return res.json({ success: false, message: "User not found" });
      }

      const user = result[0];

      if (user.last_forgot_request) {
        const last = new Date(user.last_forgot_request);
        last.setHours(0, 0, 0, 0);

        if (last.getTime() === today.getTime()) {
          return res.json({
            success: false,
            message: "You can reset password only once per day"
          });
        }
      }

      db.query(
        "UPDATE users SET last_forgot_request = ? WHERE id = ?",
        [today, user.id],
        () => {
          res.json({
            success: true,
            message: "Please set your new password"
          });
        }
      );
    }
  );
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.json({ success: false, message: "Invalid request" });
  }

  const lettersOnly = /^[A-Za-z]+$/;
  if (!lettersOnly.test(newPassword)) {
    return res.json({
      success: false,
      message: "Password must contain only letters"
    });
  }

  const cleanEmail = email.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  db.query(
    "UPDATE users SET password = ? WHERE email = ?",
    [hashedPassword, cleanEmail],
    (err, result) => {
      if (err) return res.json({ success: false, message: "Server error" });

      if (result.affectedRows === 0) {
        return res.json({ success: false, message: "User not found" });
      }

      res.json({
        success: true,
        message: "Password updated successfully"
      });
    }
  );
};
