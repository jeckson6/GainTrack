import React from "react";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

export default function HealthChart({ records }) {
    // sort by date
    const sorted = [...records].sort(
        (a, b) => new Date(a.recorded_date) - new Date(b.recorded_date)
    );

    const labels = sorted.map(r =>
        new Date(r.recorded_date).toISOString().slice(0, 10)
    );

    const weightData = sorted.map(r => r.weight_kg);
    const bmiData = sorted.map(r => r.bmi);

    const data = {
        labels,
        datasets: [
            {
                label: "Weight (kg)",
                data: weightData,
                borderColor: "rgb(59,130,246)", // blue
                tension: 0.3
            },
            {
                label: "BMI",
                data: bmiData,
                borderColor: "rgb(16,185,129)", // green
                tension: 0.3
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" }
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Health Progress Overview
            </h2>
            <Line data={data} options={options} />
        </div>
    );
}
