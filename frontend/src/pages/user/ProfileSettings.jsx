import React, { useEffect, useState } from "react";

export default function ProfileSettings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^[0-9]{9,12}$/; // Malaysia safe range

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const e = {};

    if (!form.firstName.trim()) {
      e.firstName = "First name is required";
    } else if (!nameRegex.test(form.firstName)) {
      e.firstName = "First name cannot contain numbers or symbols";
    }

    if (!form.lastName.trim()) {
      e.lastName = "Last name is required";
    } else if (!nameRegex.test(form.lastName)) {
      e.lastName = "Last name cannot contain numbers or symbols";
    }

    if (!form.gender) {
      e.gender = "Gender is required";
    }

    if (!form.contact.trim()) {
      e.contact = "Contact number is required";
    } else if (!phoneRegex.test(form.contact)) {
      e.contact = "Contact must contain 9–12 digits only";
    }

    if (!form.dateOfBirth) {
      e.dateOfBirth = "Date of birth is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };


  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    contact: "",
    dateOfBirth: ""
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    show: false
  });

  /* ======================
     LOAD PROFILE
  ====================== */
  useEffect(() => {
    fetch(`http://localhost:5000/api/users/profile?userId=${user.user_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setForm({
            firstName: data.user_first_name || "",
            lastName: data.user_last_name || "",
            gender: data.user_gender || "Male",
            contact: data.user_contact || "",
            dateOfBirth: data.user_date_of_birth?.slice(0, 10) || ""
          });
        }
      })
      .catch(console.error);
  }, [user.user_id]);

  /* ======================
     SAVE PROFILE
  ====================== */
  const saveProfile = async () => {
    if (!validateForm()) return;

    await fetch("http://localhost:5000/api/users/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.user_id,
        ...form
      })
    });

    alert("Profile updated successfully ✅");
    window.dispatchEvent(new Event("profileUpdated"));
  };

  /* ======================
     CHANGE PASSWORD
  ====================== */
  const changePassword = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/users/password/change",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.user_id,
            currentPassword: passwords.current,
            newPassword: passwords.new
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Password change failed");
        return;
      }

      alert("Password updated 🔒");
      setPasswords({ current: "", new: "", show: false });

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ======================
          PAGE HEADER
      ====================== */}
      <div>
        <h1 className="text-2xl font-bold">👤 Profile Settings</h1>
        <p className="text-gray-600">
          Manage your personal information and account security
        </p>
      </div>

      {/* ======================
          PROFILE INFO
      ====================== */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          🧾 Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="First Name" desc="Your given name" error={errors.firstName}>
            <input
              value={form.firstName}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
            />
          </Field>

          <Field label="Last Name" desc="Your family name" error={errors.lastName}>
            <input
              value={form.lastName}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
            />
          </Field>

          <Field
            label="Gender"
            desc="Used for fitness & nutrition calculations"
          >
            <select
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </Field>

          <Field
            label="Contact Number"
            desc="For account recovery & notifications" error={errors.contact}
          >
            <input
              value={form.contact}
              onChange={(e) =>
                setForm({ ...form, contact: e.target.value })
              }
            />
          </Field>

          <Field
            label="Date of Birth"
            desc="Used for age-based health insights"
          >
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) =>
                setForm({ ...form, dateOfBirth: e.target.value })
              }
            />
          </Field>
        </div>

        <button
          onClick={saveProfile}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Save Profile
        </button>
      </div>

      {/* ======================
          SECURITY
      ====================== */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          🔒 Account Security
        </h2>

        <p className="text-sm text-gray-500">
          Use a strong password with at least 8 characters
        </p>

        <input
          type={passwords.show ? "text" : "password"}
          placeholder="Current Password"
          className="w-full border p-2 rounded"
          value={passwords.current}
          onChange={(e) =>
            setPasswords({ ...passwords, current: e.target.value })
          }
        />

        <input
          type={passwords.show ? "text" : "password"}
          placeholder="New Password"
          className="w-full border p-2 rounded"
          value={passwords.new}
          onChange={(e) =>
            setPasswords({ ...passwords, new: e.target.value })
          }
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={passwords.show}
            onChange={() =>
              setPasswords({
                ...passwords,
                show: !passwords.show
              })
            }
          />
          Show password
        </label>

        <button
          onClick={changePassword}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

/* ======================
   FIELD COMPONENT
====================== */
function Field({ label, desc, error, children }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <p className="text-xs text-gray-500 mb-1">{desc}</p>

      {React.cloneElement(children, {
        className: `w-full border p-2 rounded ${
          error ? "border-red-500" : ""
        }`
      })}

      {error && (
        <p className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
