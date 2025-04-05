// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaBriefcase, FaFileAlt, FaBell } from 'react-icons/fa';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import DashboardCard from '../components/dashboard/DashboardCard';
import JobMatchCard from '../components/dashboard/JobMatchCard';
import ResumeCard from '../components/dashboard/ResumeCard';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../services/api';
import { downloadResume, deleteResume } from '../services/resumes';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const handleDownloadResume = async (resume) => {
    try {
      const blob = await downloadResume(resume.resumeId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = resume.fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast('Resume downloaded successfully', 'success');
    } catch (err) {
      console.error('Error downloading resume:', err);
      showToast('Failed to download resume', 'error');
    }
  };

  const handleDeleteResume = async (resume) => {
    if (!window.confirm(`Are you sure you want to delete "${resume.fileName}"?`)) {
      return;
    }
    
    try {
      await deleteResume(resume.resumeId);
      
      // Update dashboard data to remove the deleted resume
      setDashboardData(prev => ({
        ...prev,
        resumes: prev.resumes.filter(r => r.resumeId !== resume.resumeId),
        latestResume: prev.latestResume?.resumeId === resume.resumeId ? null : prev.latestResume
      }));
      
      showToast('Resume deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting resume:', err);
      showToast('Failed to delete resume', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 mb-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Resume Upload"
          icon={FaUpload}
          description="Upload your resume to find matching jobs"
          linkTo="/resumes/upload"
          linkText="Upload Resume"
          color="blue"
        />
        
        <DashboardCard
          title="Job Listings"
          icon={FaBriefcase}
          description="Browse all available job opportunities"
          linkTo="/jobs"
          linkText="View Jobs"
          color="green"
        />
        
        <DashboardCard
          title="Notifications"
          icon={FaBell}
          count={dashboardData?.unreadCount || 0}
          description="unread notifications"
          linkTo="/notifications"
          linkText="View All"
          color="purple"
        />
      </div>
      
      {(!dashboardData?.resumes || dashboardData.resumes.length === 0) && (
        <Card className="mb-8 text-center py-8">
          <FaFileAlt className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Resumes Yet</h3>
          <p className="mt-1 text-gray-500">
            Upload your resume to start matching with jobs
          </p>
          <div className="mt-6">
            <Link
              to="/resumes/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <FaUpload className="-ml-1 mr-2 h-5 w-5" />
              Upload Resume
            </Link>
          </div>
        </Card>
      )}
      
      {dashboardData?.resumes && dashboardData.resumes.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Resumes</h2>
            <Link to="/resumes" className="text-blue-600 hover:underline text-sm font-medium">
              View All Resumes
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.resumes.slice(0, 3).map((resume) => (
              <ResumeCard
                key={resume.resumeId}
                resume={resume}
                onDownload={handleDownloadResume}
                onDelete={handleDeleteResume}
              />
            ))}
          </div>
        </div>
      )}
      
      {dashboardData?.matches && dashboardData.matches.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Job Matches</h2>
            <Link to="/jobs" className="text-blue-600 hover:underline text-sm font-medium">
              View All Jobs
            </Link>
          </div>
          
          {dashboardData.matches.slice(0, 3).map((match) => (
            <JobMatchCard key={match.matchId} match={match} />
          ))}
        </div>
      ) : dashboardData?.resumes && dashboardData.resumes.length > 0 ? (
        <Card className="text-center py-8">
          <FaBriefcase className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Job Matches Yet</h3>
          <p className="mt-1 text-gray-500">
            We'll notify you when we find jobs that match your skills
          </p>
          <div className="mt-6">
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <FaBriefcase className="-ml-1 mr-2 h-5 w-5" />
              Browse Jobs
            </Link>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default DashboardPage;