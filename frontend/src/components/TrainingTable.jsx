import React from "react";

export default function TrainingTable({ trainingPlan }) {
  if (!Array.isArray(trainingPlan) || trainingPlan.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No training plan available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {trainingPlan.map((day, dayIndex) => (
        <div
          key={`${day.day}-${dayIndex}`}
          className="bg-gray-50 p-4 rounded border"
        >
          <h3 className="font-semibold text-lg">
            {day.day} — {day.focus}
          </h3>

          <table className="w-full mt-3 text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left">Exercise</th>
                <th className="border px-2 py-1 text-center">Sets</th>
                <th className="border px-2 py-1 text-center">Reps</th>
                <th className="border px-2 py-1 text-center">Rest</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(day.exercises) &&
                day.exercises.map((ex, exIndex) => (
                  <tr key={exIndex}>
                    <td className="border px-2 py-1">{ex.name}</td>
                    <td className="border px-2 py-1 text-center">{ex.sets}</td>
                    <td className="border px-2 py-1 text-center">{ex.reps}</td>
                    <td className="border px-2 py-1 text-center">
                      {ex.rest || "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
