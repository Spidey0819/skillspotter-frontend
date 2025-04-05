
// src/pages/admin/Dashboard.jsx
import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import AdminDashboard from '../../components/admin/AdminDashboard';

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <AdminDashboard />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;