import React from "react";

export default function TrainingTable({ trainingPlan }) {
  // Safety guard
  if (!Array.isArray(trainingPlan) || trainingPlan.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No training plan available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {trainingPlan.map((day) => (
        <div
          key={`${day.day}-${day.focus}`}
          className="bg-gray-50 p-4 rounded border"
        >
          <h3 className="font-semibold text-lg">
            {day.day} — {day.focus}
          </h3>

          <ul className="list-disc ml-5 text-sm text-gray-700 mt-2">
            {Array.isArray(day.exercises) &&
              day.exercises.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
