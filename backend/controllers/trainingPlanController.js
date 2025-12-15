const db = require("../config/db");

exports.getPlansByUser = (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "UserID required" });
  }

  const sql = `
    SELECT * FROM AITrainingPlan
    WHERE UserID = ?
    ORDER BY CreatedAt DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(results);
  });
};

exports.createPlan = (req, res) => {
  const { userId, planType, trainingMethod, weeklySchedule } = req.body;

  const sql = `
    INSERT INTO AITrainingPlan
    (UserID, PlanType, TrainingMethod, WeeklySchedule, CreatedAt)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [userId, planType, trainingMethod, weeklySchedule],
    (err) => {
      if (err) return res.status(500).json({ message: "Insert failed" });
      res.json({ message: "Training plan created" });
    }
  );
};
