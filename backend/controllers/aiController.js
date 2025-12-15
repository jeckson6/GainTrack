const openaiService = require("../services/openaiService");

exports.generateAIPlan = async (req, res) => {
  try {
    const { height, weight, bmi } = req.body;

    if (!height || !weight || !bmi) {
      return res.status(400).json({ message: "Missing body data" });
    }

    const aiResult = await openaiService.generatePlan({
      height,
      weight,
      bmi
    });

    res.json(aiResult);
  } catch (err) {
    console.error("🔥 OpenAI ERROR:", err);

    res.status(500).json({
      message: "AI generation failed",
      error: err.message || err
    });
  }
};
