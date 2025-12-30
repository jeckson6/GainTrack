import React, { useEffect, useState } from "react";

export default function ProfileModal({ profile, onClose, onSave }) {
  const isCreate = profile?.mode === "create";
  const [editMode, setEditMode] = useState(isCreate);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    email: "",
    password: "",
    makeAdmin: false,
    firstName: "",
    lastName: "",
    gender: "",
    contact: "",
    dateOfBirth: "",
    isActive: true
  });

  useEffect(() => {
    if (!profile || isCreate) return;

    setForm({
    email: profile.user_email ?? "",
    password: "",
    makeAdmin: profile.role === "admin",
    firstName: profile.first_name ?? "",
    lastName: profile.last_name ?? "",
    gender: profile.gender ?? "",
    contact: profile.contact ?? "",
    dateOfBirth: profile.date_of_birth ?? "",
    isActive: Boolean(profile.is_active)
  });

    setEditMode(false);
  }, [profile?.user_id]);

  const onChange = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const e = {};

    if (isCreate && !form.email) e.email = "Email is required";
    if (isCreate && !form.password) e.password = "Password is required";

    if (form.email && !form.email.includes("@"))
      e.email = "Invalid email format";

    if (isCreate && form.password.length < 6)
      e.password = "Minimum 6 characters";

    if (!isCreate) {
      if (!form.firstName) e.firstName = "Required";
      if (!form.lastName) e.lastName = "Required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

 const handleSave = () => {
  if (!validate()) return;

  if (typeof onSave === "function") {
   onSave({
      ...form,
      userId: profile?.user_id  
    });
  } else {
    console.error("onSave not provided to ProfileModal");
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">
            {isCreate ? "Create User" : "User Profile"}
          </h2>

          {!isCreate && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
            >
              Edit
            </button>
          )}
        </div>

        {!isCreate && (
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <Info label="Email" value={profile?.user_email} />
            <Info label="Role" value={profile?.role} />
          </div>
        )}

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {isCreate && (
            <>
              <Field label="Email" error={errors.email}>
                <input value={form.email} onChange={onChange("email")} />
              </Field>

              <Field label="Password" error={errors.password}>
                <input
                  type="password"
                  value={form.password}
                  onChange={onChange("password")}
                />
              </Field>
            </>
          )}

          {!isCreate && (
            <>
              <Field label="First Name" error={errors.firstName}>
                <input
                  value={form.firstName}
                  onChange={onChange("firstName")}
                  disabled={!editMode}
                />
              </Field>

              <Field label="Last Name" error={errors.lastName}>
                <input
                  value={form.lastName}
                  onChange={onChange("lastName")}
                  disabled={!editMode}
                />
              </Field>

              <Field label="Gender">
                <select
                  value={form.gender}
                  onChange={onChange("gender")}
                  disabled={!editMode}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Contact">
                <input
                  value={form.contact}
                  onChange={onChange("contact")}
                  disabled={!editMode}
                />
              </Field>

              <Field label="Date of Birth">
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={onChange("dateOfBirth")}
                  disabled={!editMode}
                />
              </Field>

              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={onChange("isActive")}
                  disabled={!editMode}
                />
                Active Account
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose}>Cancel</button>

          {(isCreate || editMode) && (
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1">{label}</label>
      {React.cloneElement(children, {
        className:
          "w-full border rounded p-2 disabled:bg-gray-100 disabled:text-gray-600"
      })}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <p>
      <b>{label}:</b> {value || "-"}
    </p>
  );
}
