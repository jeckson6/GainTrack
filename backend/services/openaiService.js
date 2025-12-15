const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generatePlan({ height, weight, bmi }) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a professional fitness and nutrition coach."
      },
      {
        role: "user",
        content: `
Height: ${height} cm
Weight: ${weight} kg
BMI: ${bmi}

Return ONLY valid JSON with:
- goal
- dailyCalories
- meals (with nutrition)
- trainingPlan
        `
      }
    ],
    temperature: 0.7
  });

  return JSON.parse(completion.choices[0].message.content);
}

module.exports = { generatePlan };
