import React from "react";
import maleAvatar from "../assets/male.png";
import femaleAvatar from "../assets/female.png";
import { FiMenu } from "react-icons/fi";

export default function TopNavbar({ toggleSidebar }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  const avatar =
    user.Gender === "Female" ? femaleAvatar : maleAvatar;

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-black text-xl"
      >
        <FiMenu />
      </button>

      {/* User info */}
      <div className="flex items-center gap-3">
        <span className="text-gray-600 text-sm">{user.Email}</span>
        <img
          src={avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </div>
  );
}
