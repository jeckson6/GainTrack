const db = require("../config/db");

// CREATE
exports.createRecord = (req, res) => {
  const {
    userId,
    weight,
    bodyFat,
    bmi,
    activityLevel,
    goalType,
    recordedDate
  } = req.body;

  const sql = `
    INSERT INTO HealthRecords
    (UserID, Weight_kg, BodyFatPercentage, BMI, ActivityLevel, GoalType, RecordedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [userId, weight, bodyFat, bmi, activityLevel, goalType, recordedDate],
    (err) => {
      if (err) return res.status(500).json({ message: "Insert failed" });
      res.json({ message: "Health record added" });
    }
  );
};

// READ
exports.getRecords = (req, res) => {
  const userId = req.query.userId;

  db.query(
    "SELECT * FROM HealthRecords WHERE UserID = ? ORDER BY RecordedDate DESC",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Fetch failed" });
      res.json(results);
    }
  );
};

// UPDATE
exports.updateRecord = (req, res) => {
  const { recordId } = req.params;
  const { weight, bodyFat, bmi } = req.body;

  db.query(
    `UPDATE HealthRecords
     SET Weight_kg=?, BodyFatPercentage=?, BMI=?
     WHERE RecordID=?`,
    [weight, bodyFat, bmi, recordId],
    (err) => {
      if (err) return res.status(500).json({ message: "Update failed" });
      res.json({ message: "Record updated" });
    }
  );
};

// DELETE
exports.deleteRecord = (req, res) => {
  const { recordId } = req.params;

  db.query(
    "DELETE FROM HealthRecords WHERE RecordID=?",
    [recordId],
    (err) => {
      if (err) return res.status(500).json({ message: "Delete failed" });
      res.json({ message: "Record deleted" });
    }
  );
};
