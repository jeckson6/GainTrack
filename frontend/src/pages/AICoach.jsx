import { useState } from "react";

export default function AICoach() {
  const [result, setResult] = useState(null);

  const generate = async () => {
    const res = await fetch("http://localhost:5000/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        height: 175,
        weight: 68,
        bmi: 22.2
      })
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-6">
      <button
        onClick={generate}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        🤖 Generate AI Plan
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Goal: {result.goal}</h2>

          <h3 className="mt-4 font-semibold">Training Plan</h3>
          <ul>
            {result.trainingPlan.map((t, i) => (
              <li key={i}>• {t}</li>
            ))}
          </ul>

          <h3 className="mt-4 font-semibold">Meals</h3>
          {result.meals.map((m, i) => (
            <div key={i} className="border p-3 mt-2 rounded">
              <strong>{m.name}</strong>
              <p>Foods: {m.foods.join(", ")}</p>
              <p>Calories: {m.nutrition.calories}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
