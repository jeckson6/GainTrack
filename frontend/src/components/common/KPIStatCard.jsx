import React from "react";

export default function KPIStatCard({ title, value, color = "text-gray-800" }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 text-center">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
