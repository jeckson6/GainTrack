const db = require("../config/db");

exports.getProfile = (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: "UserID is required" });
  }

  const sql = "SELECT UserID, Email FROM Users WHERE UserID = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  });
};
