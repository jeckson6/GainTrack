import React, { useEffect, useState } from "react";
import KPIStatCard from "../../components/common/KPIStatCard";
import FoodPlanCard from "../../components/user/FoodPlanCard";
import TrainingTable from "../../components/TrainingTable";
import { generateCalendarLink } from "../../components/user/TrainingCalendar";

export default function AIAssistant() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  const [profile, setProfile] = useState(null);
  const [health, setHealth] = useState(null);
  const [goal, setGoal] = useState("");
  const [trainingStyle, setTrainingStyle] = useState("");
  const [trainingDays, setTrainingDays] = useState(null);

  const [aiResult, setAIResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateAge = (dob) => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(profile?.user_date_of_birth);

  const canUseAI =
    goal &&
    trainingStyle &&
    trainingDays &&
    profile?.user_gender &&
    profile?.user_date_of_birth;

  const days = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
  ];
  const [selectedDay, setSelectedDay] = useState("Monday");

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/ai/health-summary?userId=${user.user_id}`
    )
      .then(res => res.json())
      .then(setHealth);
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/users/profile?userId=${userId}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));

  }, [userId]);

  const analyzeHealth = async () => {
    if (!goal || !trainingStyle || !trainingDays) {
      setError("Please select goal, training style, and training frequency.");
      return;
    }

    if (!profile?.user_gender || !profile?.user_date_of_birth) {
      setError("Please complete your gender and date of birth in Profile.");
      return;
    }

    setError("");
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.user_id,
        goal,
        trainingStyle,
        trainingDays
      })
    });

    const data = await res.json();
    setAIResult(data);
    setLoading(false);
  };

  const calendarLink = generateCalendarLink(aiResult?.trainingPlan);

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* ======================
          HEADER
      ====================== */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow">
        <h1 className="text-3xl font-bold">
          🤖 GainTrack AI Assistant
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Personalized training & nutrition powered by your health data
        </p>
      </div>

      {/* ======================
    HEALTH SNAPSHOT
====================== */}
      {health && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <KPIStatCard
            title="Gender"
            value={profile?.user_gender || "N/A"}
          />
          <KPIStatCard
            title="Age"
            value={age ? `${age} yrs` : "N/A"}
          />
          <KPIStatCard title="Height" value={`${health.height_cm} cm`} />
          <KPIStatCard title="Weight" value={`${health.weight_kg} kg`} />
          <KPIStatCard title="BMI" value={health.bmi} />
          <KPIStatCard
            title="Body Fat"
            value={
              health.body_fat_percentage !== null
                ? `${health.body_fat_percentage}%`
                : "N/A"
            }
          />
        </div>

      )}


      {/* ======================
    AI PREFERENCES
====================== */}
      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        <h2 className="text-lg font-semibold mb-6">
          ⚙️ AI Preferences
        </h2>

        <div className="space-y-5">

          {/* GOAL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <p className="font-medium">Fitness Goal</p>
              <p className="text-sm text-gray-500">
                Select your primary objective
              </p>
            </div>

            <div className="md:col-span-2">
              <select
                className="w-full border p-3 rounded"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              >
                <option value="">Select goal</option>
                <option value="Bulking">Bulking (Muscle Gain)</option>
                <option value="Maintain">Maintain (Balanced)</option>
                <option value="Cutting">Cutting (Fat Loss)</option>
              </select>
            </div>
          </div>

          {/* TRAINING STYLE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <p className="font-medium">Training Style</p>
              <p className="text-sm text-gray-500">
                Preferred workout structure
              </p>
            </div>

            <div className="md:col-span-2">
              <select
                className="w-full border p-3 rounded"
                value={trainingStyle}
                onChange={(e) => setTrainingStyle(e.target.value)}
              >
                <option value="">Select training style</option>
                <option value="Push Pull Legs">Push / Pull / Legs</option>
                <option value="Upper Lower">Upper / Lower</option>
                <option value="Full Body">Full Body</option>
              </select>
            </div>
          </div>

          {/* TRAINING DAYS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-1">
              <p className="font-medium">Training Frequency</p>
              <p className="text-sm text-gray-500">
                Days you can train per week
              </p>
            </div>

            <div className="md:col-span-2">
              <select
                className="w-full border p-3 rounded"
                value={trainingDays ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setTrainingDays(value ? Number(value) : null);
                }}
              >
                <option value="">Select training frequency</option>
                <option value="3">3 days / week</option>
                <option value="4">4 days / week</option>
                <option value="5">5 days / week</option>
                <option value="6">6 days / week</option>
              </select>
            </div>
          </div>

          {/* WARNING MESSAGE */}
          {(!profile?.user_gender || !profile?.user_date_of_birth) && (
            <p className="text-sm text-red-500 mt-2">
              Please complete your gender and date of birth in Profile before using AI.
            </p>
          )}

          {/* ACTION BUTTON */}
          <button
            onClick={analyzeHealth}
            disabled={!canUseAI || loading}
            className={`w-full py-3 rounded mt-4 text-white
    ${(!canUseAI || loading)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Analyzing with AI..." : "Generate AI Plan"}
          </button>

          {/* VALIDATION MESSAGE */}
          {error && (
            <p className="text-sm text-red-500 mt-2">
              {error}
            </p>
          )}
        </div>
      </div>


      {/* ======================
          FOOD PLAN
      ====================== */}
      {aiResult?.weeklyMeals && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            🍽️ AI Food Plan
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-1.5 rounded-full text-sm
                  ${selectedDay === day
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(aiResult.weeklyMeals?.[selectedDay]) ? (
              aiResult.weeklyMeals[selectedDay].map((meal, i) => (
                <FoodPlanCard key={i} meal={meal} />
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No meal plan available for this day.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ======================
          TRAINING PLAN
      ====================== */}
      {aiResult?.trainingPlan && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              🏋️ AI Training Plan
            </h2>

            <a
              href={calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            >
              📅 Add to Calendar
            </a>
          </div>

          <TrainingTable trainingPlan={aiResult.trainingPlan} />
        </div>
      )}
    </div>
  );
}
