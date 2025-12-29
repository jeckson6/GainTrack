import React, { useEffect, useState } from "react";

export default function AIUsageMonitor() {
  const [usage, setUsage] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [saving, setSaving] = useState(false);

  const adminUserId = JSON.parse(localStorage.getItem("user"))?.UserID;

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {
    fetch("http://localhost:5000/api/admins/ai-usage")
      .then((res) => res.json())
      .then(setUsage);

    fetch("http://localhost:5000/api/admins/config")
      .then((res) => res.json())
      .then((data) => {
        setAnnouncement(data.announcement || "");
        setExpiresAt(data.expiresAt || "");
      });
  }, []);

  const saveAnnouncement = async () => {
    setSaving(true);

    await fetch("http://localhost:5000/api/admins/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        announcement,
        expiresAt: expiresAt || null,
        adminUserId
      })
    });

    setSaving(false);
    alert("Announcement saved");
  };

  if (!usage) {
    return (
      <div className="p-6 text-gray-500">
        Loading AI usage data...
      </div>
    );
  }

  const unsplashPercent = Math.round(
    (usage.unsplash.used / usage.unsplash.limit) * 100
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800">
        🤖 AI Usage & System Control
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPI
          title="Unsplash API Usage"
          value={`${usage.unsplash.used} / ${usage.unsplash.limit}`}
          subtitle={`${unsplashPercent}% used`}
          color={
            unsplashPercent > 80
              ? "bg-red-500"
              : unsplashPercent > 60
              ? "bg-yellow-500"
              : "bg-green-500"
          }
        />

        <KPI
          title="OpenAI Requests Today"
          value={usage.openai.today}
          subtitle="Daily usage"
          color="bg-indigo-600"
        />

        <KPI
          title="AI Status"
          value="Operational"
          subtitle="All services running"
          color="bg-emerald-600"
        />
      </div>

      {/* USAGE DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UNSPLASH USAGE */}
        <div className="bg-white shadow rounded-xl p-5">
          <h3 className="font-semibold text-gray-700 mb-4">
            📸 Unsplash API Usage
          </h3>

          <progress
            value={usage.unsplash.used}
            max={usage.unsplash.limit}
            className="w-full h-3 rounded"
          />

          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{usage.unsplash.used} used</span>
            <span>{usage.unsplash.limit} limit</span>
          </div>

          {unsplashPercent > 80 && (
            <p className="mt-3 text-sm text-red-600 font-medium">
              ⚠ Usage nearing monthly limit
            </p>
          )}
        </div>

        {/* OPENAI USAGE */}
        <div className="bg-white shadow rounded-xl p-5">
          <h3 className="font-semibold text-gray-700 mb-4">
            🧠 OpenAI Usage Summary
          </h3>

          <div className="space-y-3 text-sm">
            <UsageRow label="Requests Today" value={usage.openai.today} />
            <UsageRow label="Service Mode" value="Production" />
            <UsageRow label="Rate Limiting" value="Enabled" />
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENT */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 mb-3">
          📢 System Announcement
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          Display system-wide messages to all users (e.g. maintenance, AI limits)
        </p>

        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          className="w-full border rounded p-3 mb-3 text-sm"
          rows={4}
          placeholder="Enter announcement message..."
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="border rounded p-2 text-sm"
          />

          <button
            onClick={saveAnnouncement}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded text-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Announcement"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================
   REUSABLE COMPONENTS
====================== */

function KPI({ title, value, subtitle, color }) {
  return (
    <div className={`rounded-xl p-5 text-white shadow ${color}`}>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs opacity-80 mt-1">{subtitle}</p>
    </div>
  );
}

function UsageRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2 last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
