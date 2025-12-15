const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.0-pro"
    });

    const result = await model.generateContent(
      "Say hello and confirm Gemini API is working."
    );

    console.log("✅ Gemini response:");
    console.log(result.response.text());
  } catch (err) {
    console.error("❌ Gemini error:", err.message);
  }
}

test();
