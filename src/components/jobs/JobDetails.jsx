import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import Card from '../common/Card';
import SkillBadge from '../common/SkillBadge';
import Spinner from '../common/Spinner';
import { getJobById, getJobMatchDetails } from '../../services/jobs';

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const jobData = await getJobById(jobId);
        setJob(jobData);

        // Try to fetch match details if available
        try {
          const matchData = await getJobMatchDetails(jobId);
          setMatchDetails(matchData.matchDetails);
        } catch (matchError) {
          // Silently fail - match details might not be available
          console.log('No match details available');
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
        <Link to="/jobs" className="flex items-center text-blue-600 hover:underline">
          <FaArrowLeft className="mr-2" /> Back to Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>Job not found.</p>
        </div>
        <Link to="/jobs" className="flex items-center text-blue-600 hover:underline">
          <FaArrowLeft className="mr-2" /> Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/jobs" className="flex items-center text-blue-600 hover:underline mb-6">
        <FaArrowLeft className="mr-2" /> Back to Jobs
      </Link>

      <Card className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex flex-wrap items-center text-gray-600 mb-4">
              <div className="flex items-center mr-4 mb-2">
                <FaBuilding className="mr-1" />
                <span>{job.company}</span>
              </div>
              {job.location && (
                <div className="flex items-center mr-4 mb-2">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{job.location}</span>
                </div>
              )}
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="mr-1" />
                <span>Posted on {new Date(job.postTimestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          {job.isActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Closed
            </span>
          )}
        </div>

        {matchDetails && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Match</h2>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${matchDetails.skillScore}%` }}
                ></div>
              </div>
              <span className="ml-2 text-blue-700 font-bold">{matchDetails.skillScore}%</span>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Matching Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {matchDetails.matchingSkills.map((skill, index) => (
                  <SkillBadge key={index} skill={skill} variant="success" />
                ))}
              </div>
            </div>
            
            {matchDetails.missingSkills && matchDetails.missingSkills.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Missing Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {matchDetails.missingSkills.map((skill, index) => (
                    <SkillBadge key={index} skill={skill} variant="warning" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h2>
          <div className="prose prose-blue max-w-none">
            {job.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills && job.requiredSkills.length > 0 ? (
              job.requiredSkills.map((skill, index) => (
                <SkillBadge key={index} skill={skill} />
              ))
            ) : (
              <p className="text-gray-600">No specific skills listed</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobDetails;