import React from 'react';
import AuthLayout from '../layouts/AuthLayout';

export default function Login() {
  return (
    <AuthLayout title="Login to GainTrack">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem('token', 'fake-jwt-token');
          window.location.href = '/dashboard';
        }}
      >

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-400"
            placeholder="user@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-400"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{' '}
          <a href="/register" className="text-green-500 hover:underline">
            Register
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
