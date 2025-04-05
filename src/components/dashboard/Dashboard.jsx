// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaUpload, FaBriefcase, FaBell, FaFileAlt } from 'react-icons/fa';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    resumes: [],
    latestResume: null,
    matches: [],
    unreadCount: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/user/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/resumes/upload" className="card hover:shadow-lg transition-shadow p-6 flex flex-col items-center justify-center text-center">
          <FaUpload className="text-primary text-2xl mb-3" />
          <h3 className="text-lg font-semibold">Upload Resume</h3>
          <p className="text-gray-600 mt-2">Upload your resume to find matching jobs</p>
        </Link>
        
        <Link to="/jobs" className="card hover:shadow-lg transition-shadow p-6 flex flex-col items-center justify-center text-center">
          <FaBriefcase className="text-primary text-2xl mb-3" />
          <h3 className="text-lg font-semibold">Browse Jobs</h3>
          <p className="text-gray-600 mt-2">Explore all available job opportunities</p>
        </Link>
        
        <Link to="/notifications" className="card hover:shadow-lg transition-shadow p-6 flex flex-col items-center justify-center text-center">
          <div className="relative">
            <FaBell className="text-primary text-2xl mb-3" />
            {dashboardData.unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {dashboardData.unreadCount}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p className="text-gray-600 mt-2">
            {dashboardData.unreadCount > 0
              ? `You have ${dashboardData.unreadCount} unread notifications`
              : 'Check your notifications'}
          </p>
        </Link>
      </div>
      
      {/* Resume Overview */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Resumes</h2>
          <Link to="/resumes" className="text-primary hover:underline">View All</Link>
        </div>
        
        {dashboardData.resumes.length === 0 ? (
          <div className="text-center py-8">
            <FaFileAlt className="text-gray-400 text-4xl mx-auto mb-3" />
            <p className="text-gray-600">You haven't uploaded any resumes yet</p>
            <Link to="/resumes/upload" className="btn btn-primary mt-4 inline-block">
              Upload Resume
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resume Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.resumes.slice(0, 3).map((resume) => (
                    <tr key={resume.resumeId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{resume.fileName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(resume.uploadTimestamp).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {resume.extractedSkills?.length || 0} skills extracted
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/resumes/${resume.resumeId}`}
                          className="text-primary hover:underline text-sm mr-3"
                        >
                          View
                        </Link>
                        <Link
                          to={`/resumes/${resume.resumeId}/matches`}
                          className="text-primary hover:underline text-sm"
                        >
                          Matches
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      
      {/* Job Matches */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Job Matches</h2>
          <Link to="/jobs" className="text-primary hover:underline">View All</Link>
        </div>
        
        {dashboardData.matches.length === 0 ? (
          <div className="text-center py-8">
            <FaBriefcase className="text-gray-400 text-4xl mx-auto mb-3" />
            <p className="text-gray-600">
              {dashboardData.resumes.length === 0
                ? "Upload a resume to get matched with jobs"
                : "No job matches found yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matched
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.matches.slice(0, 5).map((match) => (
                  <tr key={match.matchId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{match.job?.title || 'Unknown Job'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{match.job?.company || 'Unknown Company'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {match.matchScore}% Match
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(match.matchTimestamp).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/jobs/${match.jobId}`}
                        className="text-primary hover:underline text-sm"
                      >
                        View Job
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;