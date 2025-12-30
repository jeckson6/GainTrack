const db = require("../config/db");

// ==========================
// GET ACTIVE TRAINING PLAN
// ==========================
exports.getActiveTrainingPlan = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const [[plan]] = await db.promise().query(
      `
      SELECT
        plan_type,
        training_method,
        weekly_schedule,
        created_at
      FROM ai_training_plan
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    if (!plan) return res.json(null);

    res.json({
      planType: plan.plan_type,
      trainingMethod: plan.training_method,
      trainingPlan: plan.weekly_schedule, // JSON column → NO parse
      createdAt: plan.created_at
    });

  } catch (err) {
    console.error("GET ACTIVE TRAINING PLAN ERROR:", err);
    res.status(500).json({ message: "Failed to load training plan" });
  }
};

// ==========================
// TRAINING PLAN HISTORY
// ==========================
exports.getTrainingPlanHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const [plans] = await db.promise().query(
      `
      SELECT
        plan_id,
        plan_type,
        training_method,
        created_at
      FROM ai_training_plan
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(plans);

  } catch (err) {
    console.error("GET TRAINING HISTORY ERROR:", err);
    res.status(500).json({ message: "Failed to load training history" });
  }
};
