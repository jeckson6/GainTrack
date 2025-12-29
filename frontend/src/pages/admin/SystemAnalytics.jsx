import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

/* ======================
   COLOR SCHEMES
====================== */
const TRAINING_COLORS = ["#6366f1", "#22c55e", "#f97316", "#ec4899"];
const GENDER_COLORS = ["#3b82f6", "#ec4899", "#facc15"];

export default function SystemAnalytics() {
  const [training, setTraining] = useState([]);
  const [gender, setGender] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admins/analytics/training")
      .then((res) => res.json())
      .then(setTraining);

    fetch("http://localhost:5000/api/admins/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setGender([
          { name: "Male", value: d.maleCount },
          { name: "Female", value: d.femaleCount },
          { name: "Other", value: d.otherCount }
        ]);

        fetch("http://localhost:5000/api/admins/system-logs")
          .then((res) => res.json())
          .then(setLogs);
      });
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800">
        📈 System Analytics
      </h1>

      {/* ======================
          ANALYTICS CHARTS
      ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TRAINING DISTRIBUTION */}
        <div className="bg-white p-5 shadow rounded-xl">
          <h3 className="font-semibold text-gray-700 mb-3">
            🏋️ Training Distribution
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={training}>
              <XAxis dataKey="TrainingMethod" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {training.map((_, i) => (
                  <Cell
                    key={i}
                    fill={TRAINING_COLORS[i % TRAINING_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GENDER OVERVIEW */}
        <div className="bg-white p-5 shadow rounded-xl">
          <h3 className="font-semibold text-gray-700 mb-3">
            👥 Gender Overview
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={gender}
                dataKey="value"
                label
                innerRadius={60}
                outerRadius={100}
              >
                {gender.map((_, i) => (
                  <Cell
                    key={i}
                    fill={GENDER_COLORS[i % GENDER_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ======================
          SYSTEM LOGS (CENTERED)
      ====================== */}
      <div className="bg-white shadow rounded-xl p-5 max-w-5xl mx-auto">
        <h3 className="font-semibold text-gray-700 mb-4 text-center">
          🧾 System Logs
        </h3>

        {logs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            No system activities recorded.
          </p>
        ) : (
          <div className="max-h-[420px] overflow-y-auto border rounded">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Admin</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Target</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.LogID}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-gray-500">
                      {new Date(log.CreatedAt).toLocaleString()}
                    </td>

                    <td className="p-3 font-medium text-gray-800">
                      {log.AdminEmail}
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-indigo-100 text-indigo-700">
                        {log.Action.replace("_", " ").toLowerCase()}
                      </span>
                    </td>

                    <td className="p-3 text-gray-700">
                      {log.Target || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
