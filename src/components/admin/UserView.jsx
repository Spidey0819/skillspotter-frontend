import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

const UserView = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/admin/users/${userId}`);
        setUser(response.data.user);
        setResumes(response.data.resumes || []);
        setMatches(response.data.matches || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Note:</strong>
        <span className="block sm:inline"> User not found</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Users List
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name:</p>
              <p className="font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Role:</p>
              <p className="font-semibold uppercase">{user.role}</p>
            </div>
            <div>
              <p className="text-gray-600">Created At:</p>
              <p className="font-semibold">{formatDate(user.createdAt)}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
              Send Notification
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Delete User
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Resumes
          </button>
          <button
            className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'matches'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('matches')}
          >
            Job Matches
          </button>
        </nav>
      </div>

      {/* Resumes Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Uploaded Resumes</h3>
            
            {resumes.length === 0 ? (
              <p className="text-gray-500">No resumes uploaded yet.</p>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Filename</th>
                    <th className="py-3 px-4 text-left">Upload Date</th>
                    <th className="py-3 px-4 text-left">Skills</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {resumes.map((resume) => (
                    <tr key={resume.resumeId} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{resume.fileName}</td>
                      <td className="py-3 px-4">{formatDate(resume.uploadTimestamp)}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(resume.extractedSkills) && resume.extractedSkills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <a 
                          href={`${API_URL}/api/admin/resumes/${resume.resumeId}/download`}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Job Matches</h3>
            
            {matches.length === 0 ? (
              <p className="text-gray-500">No job matches found.</p>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Job Title</th>
                    <th className="py-3 px-4 text-left">Company</th>
                    <th className="py-3 px-4 text-left">Match Score</th>
                    <th className="py-3 px-4 text-left">Matched Skills</th>
                    <th className="py-3 px-4 text-left">Match Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {matches.map((match) => (
                    <tr key={match.matchId} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{match.job?.title || 'Unknown Job'}</td>
                      <td className="py-3 px-4">{match.job?.company || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-blue-600 h-4 rounded-full"
                            style={{width: `${match.matchScore}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">{match.matchScore}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(match.matchingSkills) && match.matchingSkills.map((skill, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatDate(match.matchTimestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserView;