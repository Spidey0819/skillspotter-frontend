// src/pages/admin/PostJob.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import JobForm from '../../components/admin/JobForm';
import { createJob } from '../../services/jobs';
import { useNotifications } from '../../context/NotificationContext';

const PostJobPage = () => {
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (jobData) => {
    try {
      setLoading(true);
      await createJob(jobData);
      showToast('Job created successfully', 'success');
      navigate('/admin/jobs');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create job', 'error');
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Job</h1>
        <JobForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </AdminLayout>
  );
};

export default PostJobPage;