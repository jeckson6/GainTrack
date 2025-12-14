import React from 'react';
import AuthLayout from '../layouts/AuthLayout';

export default function Register() {
  return (
    <AuthLayout title="Create GainTrack Account">
      <form className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium">
            Confirm Password
          </label>
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
          Register
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-green-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
