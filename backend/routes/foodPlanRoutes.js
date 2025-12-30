const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Latest food plan
// ✅ Latest food plan
router.get("/latest", async (req, res) => {
  try {
    const { userId } = req.query;

    const [[plan]] = await db.promise().query(
      `
      SELECT
        daily_calories,
        protein_g,
        carbs_g,
        fats_g,
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
      dailyCalories: plan.daily_calories,
      macros: {
        protein: plan.protein_g,
        carbs: plan.carbs_g,
        fats: plan.fats_g
      },
weeklyMeals: plan.meal_plan,
      createdAt: plan.created_at
    });

  } catch (err) {
    console.error("GET FOOD PLAN ERROR:", err);
    res.status(500).json({ message: "Failed to load food plan" });
  }
});


// ✅ Food plan history
router.get("/history", async (req, res) => {
  try {
    const { userId } = req.query;

    const [rows] = await db.promise().query(
      `
      SELECT
        food_plan_id,
        created_at
      FROM ai_food_plan
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(rows);

  } catch (err) {
    console.error("FOOD PLAN HISTORY ERROR:", err);
    res.status(500).json({ message: "Failed to load food plan history" });
  }
});


module.exports = router;
