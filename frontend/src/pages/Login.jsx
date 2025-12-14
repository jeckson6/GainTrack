import React, { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { login } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch {
      alert('Login failed');
    }
  };

  return (
    <AuthLayout title="Login to GainTrack">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-green-500 text-white py-2 rounded">
          Login
        </button>
      </form>
    </AuthLayout>
  );
}
