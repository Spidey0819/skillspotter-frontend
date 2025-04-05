import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

const JobMatches = ({ resumeId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        let endpoint = resumeId 
          ? `${API_URL}/api/resumes/${resumeId}/matches` 
          : `${API_URL}/api/user/job-matches`;
          
        const response = await axios.get(endpoint);
        setMatches(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch job matches');
        console.error('Error fetching job matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [resumeId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-5 rounded relative text-center">
        <p className="text-lg mb-2">No job matches found</p>
        <p className="text-sm text-gray-600">
          Upload your resume to find matching job opportunities!
        </p>
        <Link 
          to="/resumes/upload" 
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div 
          key={match.matchId} 
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-blue-800">
                  <Link to={`/jobs/${match.jobId}`} className="hover:underline">
                    {match.job?.title || "Unknown Job"}
                  </Link>
                </h3>
                <p className="text-gray-700">{match.job?.company || "Unknown Company"}</p>
                <p className="text-sm text-gray-600">{match.job?.location || "Remote"}</p>
              </div>
              <div className="text-right">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-blue-600 bg-blue-200">
                        Match: {match.skillScore || match.matchScore}%
                      </span>
                    </div>
                  </div>
                  <div className="flex h-2 mt-2 mb-2 overflow-hidden text-xs bg-blue-200 rounded">
                    <div 
                      style={{ width: `${match.skillScore || match.matchScore}%` }}
                      className="flex flex-col justify-center text-center text-white bg-blue-600 shadow-none whitespace-nowrap"
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Matched on {formatDate(match.matchTimestamp)}</p>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Matching Skills:</p>
              <div className="flex flex-wrap gap-1">
                {Array.isArray(match.matchingSkills) && match.matchingSkills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-3 flex justify-end">
              <Link 
                to={`/jobs/${match.jobId}`} 
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobMatches;