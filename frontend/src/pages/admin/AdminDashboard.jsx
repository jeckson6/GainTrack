import React, { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { FiUsers, FiActivity, FiCpu, FiTrendingUp } from "react-icons/fi";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

export default function AdminDashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/admins/dashboard")
            .then(res => res.json())
            .then(setData);
    }, []);

    if (!data) return <div className="p-6">Loading dashboard...</div>;

    const genderData = [
        { name: "Male", value: data.maleCount },
        { name: "Female", value: data.femaleCount },
        { name: "Other", value: data.otherCount }
    ];

    const userStatus = [
        { name: "Active", value: data.activeUsers },
        { name: "Inactive", value: data.inactiveUsers }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-800">
                📊 Admin Dashboard Overview
            </h1>

            {/* KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <KPI title="Total Users" value={data.totalUsers} icon={<FiUsers />} color="from-indigo-500 to-indigo-700" />
                <KPI title="Active Users" value={data.activeUsers} icon={<FiActivity />} color="from-green-500 to-green-700" />
                <KPI title="AI Food Plans" value={data.totalFoodPlans} icon={<FiCpu />} color="from-purple-500 to-purple-700" />
                <KPI title="Training Plans" value={data.totalTrainingPlans} icon={<FiTrendingUp />} color="from-pink-500 to-pink-700" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Gender Distribution">
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie data={genderData} dataKey="value" label innerRadius={60} outerRadius={90}>
                                {genderData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="User Account Status">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={userStatus}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}

function KPI({ title, value, icon, color }) {
    return (
        <div
            className={`bg-gradient-to-br ${color} text-white rounded-xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-80">{title}</p>
                    <p className="text-3xl font-extrabold">{value}</p>
                </div>
                <div className="text-3xl opacity-80">{icon}</div>
            </div>
        </div>
    );
}

function Card({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-5">
            <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
            {children}
        </div>
    );
}
