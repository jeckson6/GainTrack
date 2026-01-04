const OpenAI = require("openai");
const { buildAIPrompt } = require("../services/aiPrompt");
const db = require("../config/db");
const { getFoodImage } = require("../services/unsplashService");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

// ================================
// helper: attach images permanently
// ================================
async function attachImagesToMealPlan(weeklyMeals) {
  if (!weeklyMeals || typeof weeklyMeals !== "object") return weeklyMeals;

  for (const day of Object.keys(weeklyMeals)) {
    for (const meal of weeklyMeals[day]) {
      if (!Array.isArray(meal.foods)) continue;

      for (const food of meal.foods) {
        if (!food.image || !food.image.startsWith("http")) {
          food.image = await getFoodImage(food.item);
        }
      }
    }
  }
  return weeklyMeals;
}

// ================================
// POST analyze health + generate AI
// ================================
exports.analyzeHealth = async (req, res) => {
  try {
    const { userId, goal, trainingStyle, trainingDays } = req.body;

    if (!userId || !goal || !trainingStyle || !trainingDays) {
      return res.status(400).json({ message: "Missing required AI inputs" });
    }

    const [[profile]] = await db.promise().query(
      "SELECT user_gender FROM user_profile WHERE user_id = ?",
      [userId]
    );

    const [[record]] = await db.promise().query(
      `
      SELECT height_cm, weight_kg, bmi, body_fat_percentage
      FROM health_record
      WHERE user_id = ?
      ORDER BY recorded_date DESC
      LIMIT 1
      `,
      [userId]
    );

    if (!profile || !record) {
      return res.status(400).json({ message: "Health data incomplete" });
    }

    const prompt = buildAIPrompt({
      gender: profile.user_gender,
      height: record.height_cm,
      weight: record.weight_kg,
      bmi: record.bmi,
      bodyFat: record.body_fat_percentage,
      goal,
      trainingStyle,
      trainingDays
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4
    });

    const aiResult = JSON.parse(response.choices[0].message.content);

    const weeklyMealsWithImages = await attachImagesToMealPlan(
      aiResult.weeklyMeals
    );


    // ai_food_plan
    await db.promise().query(
      `
      INSERT INTO ai_food_plan
        (user_id, daily_calories, protein_g, carbs_g, fats_g, meal_plan, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        userId,
        aiResult.dailyCalories,
        aiResult.macros.protein,
        aiResult.macros.carbs,
        aiResult.macros.fats,
        JSON.stringify(weeklyMealsWithImages)
      ]
    );

    // ai_training_plan
    await db.promise().query(
      `
  INSERT INTO ai_training_plan
    (user_id, plan_type, training_method, weekly_schedule, created_at)
  VALUES (?, ?, ?, ?, NOW())
  `,
      [
        userId,
        goal,
        trainingStyle,
        JSON.stringify(aiResult.trainingPlan)
      ]
    );

    res.json({
      dailyCalories: aiResult.dailyCalories,
      macros: aiResult.macros,
      weeklyMeals: weeklyMealsWithImages,
      trainingPlan: aiResult.trainingPlan
    });

  } catch (err) {
    console.error("AI / DB ERROR:", err);
    res.status(500).json({ message: err.sqlMessage || "AI generation failed" });
  }
};

// ================================
// GET health summary for KPI cards
// ================================
exports.getHealthSummary = async (req, res) => {
  try {
    const { userId } = req.query;

    const [[profile]] = await db.promise().query(
      "SELECT user_gender FROM user_profile WHERE user_id = ?",
      [userId]
    );

    const [[record]] = await db.promise().query(
      `
      SELECT
        height_cm,
        weight_kg,
        bmi,
        body_fat_percentage
      FROM health_record
      WHERE user_id = ?
      ORDER BY recorded_date DESC
      LIMIT 1
      `,
      [userId]
    );

    if (!record) return res.json(null);

    res.json({
      gender: profile?.user_gender || "Unknown",
      ...record
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to load health summary"
    });
  }
};
