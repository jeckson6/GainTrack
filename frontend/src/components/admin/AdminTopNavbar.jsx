import React, { useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileModal from "./ProfileModal";

export default function AdminTopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const adminUser = JSON.parse(localStorage.getItem("user"));
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState(null);

  if (!adminUser) return null;

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "text-white border-b-2 border-white"
      : "text-indigo-200 hover:text-white";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const openProfile = async () => {
    const res = await fetch(
      `http://localhost:5000/api/admins/profile?userId=${adminUser.UserID}`
    );
    const data = await res.json();
    setProfile(data);
    setShowProfile(true);
  };


  return (
    <>
      <header className="h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-between px-8 shadow-lg">
        {/* Left */}
        <div>
          <h1 className="text-lg font-extrabold tracking-wide">GainTrack</h1>
          <p className="text-xs opacity-80">Admin Control Center</p>
        </div>

        {/* Center */}
        <nav className="flex gap-8 text-sm font-medium">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className={isActive("/admin")}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className={isActive("/admin/users")}
          >
            Users
          </button>

          <button
            onClick={() => navigate("/admin/ai-usage")}
            className={isActive("/admin/ai-usage")}
          >
            AI Usage
          </button>

          <button
            onClick={() => navigate("/admin/analytics")}
            className={isActive("/admin/analytics")}
          >
            Analytics
          </button>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
            <FiUser />
            {adminUser.Email}


          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-full text-sm transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </header>
    </>
  );
}
