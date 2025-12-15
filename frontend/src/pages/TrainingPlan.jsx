import React, { useEffect, useState } from "react";

export default function TrainingPlan() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [plans, setPlans] = useState([]);

  const [form, setForm] = useState({
    planType: "Maintenance",
    trainingMethod: "Push Pull Legs",
    weeklySchedule: ""
  });

  const fetchPlans = async () => {
    const res = await fetch(
      `http://localhost:5000/api/training-plan?userId=${user.UserID}`
    );
    setPlans(await res.json());
  };

  useEffect(() => {
    if (user) fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/training-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.UserID,
        ...form
      })
    });

    fetchPlans();
    setForm({ ...form, weeklySchedule: "" });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Training Plans</h1>

      {/* LIST */}
      <div className="space-y-4 mb-6">
        {plans.map(plan => (
          <div
            key={plan.PlanID}
            className="bg-white p-4 rounded shadow"
          >
            <h2 className="font-semibold text-lg">
              {plan.PlanType} Plan
            </h2>
            <p className="text-sm text-gray-500">
              Method: {plan.TrainingMethod}
            </p>

            <pre className="bg-gray-50 p-3 mt-3 rounded text-sm">
              {plan.WeeklySchedule}
            </pre>
          </div>
        ))}
      </div>

      {/* ADD PLAN */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-3">Add Training Plan</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            className="border p-2 w-full"
            value={form.planType}
            onChange={e => setForm({ ...form, planType: e.target.value })}
          >
            <option>Bulking</option>
            <option>Cutting</option>
            <option>Maintenance</option>
          </select>

          <select
            className="border p-2 w-full"
            value={form.trainingMethod}
            onChange={e =>
              setForm({ ...form, trainingMethod: e.target.value })
            }
          >
            <option>Push Pull Legs</option>
            <option>Upper Lower</option>
            <option>Full Body</option>
          </select>

          <textarea
            className="border p-2 w-full"
            rows="5"
            placeholder="Weekly Schedule (e.g. Mon: Chest, Tue: Back...)"
            value={form.weeklySchedule}
            onChange={e =>
              setForm({ ...form, weeklySchedule: e.target.value })
            }
            required
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Plan
          </button>
        </form>
      </div>
    </div>
  );
}
