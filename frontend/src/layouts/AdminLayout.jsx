import React from "react";
import { Outlet } from "react-router-dom";
import AdminTopNavbar from "../components/admin/AdminTopNavbar";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <AdminTopNavbar />
            <main className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
                <Outlet />
            </main>
        </div>
    );
}
