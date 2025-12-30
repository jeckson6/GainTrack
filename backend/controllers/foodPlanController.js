const db = require("../config/db");

exports.getActiveFoodPlan = async (req, res) => {
  try {
    const { userId } = req.query;

    const [[plan]] = await db.promise().query(
      `
      SELECT
        meal_plan,
        created_at
      FROM ai_food_plan
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    if (!plan) return res.json(null);

    res.json({
      weeklyMeals: JSON.parse(plan.meal_plan),
      createdAt: plan.created_at
    });

  } catch (err) {
    console.error("GET ACTIVE FOOD PLAN ERROR:", err);
    res.status(500).json({ message: "Failed to load food plan" });
  }
};
