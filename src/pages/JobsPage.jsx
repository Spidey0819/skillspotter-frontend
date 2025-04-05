// src/pages/JobsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import SkillBadge from '../components/common/SkillBadge';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { getAllJobs } from '../services/jobs';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getAllJobs();
        setJobs(data);
      } catch (err) {
        setError('Failed to load jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
      </div>

      <Card className="mb-6">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10 w-full"
              placeholder="Search jobs by title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <Card className="text-center py-12">
          <FaBriefcase className="text-gray-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Jobs Found</h2>
          <p className="text-gray-600 mb-6">
            {searchTerm ? "No jobs match your search criteria" : "There are currently no job postings available"}
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.jobId} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">{job.title}</h2>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {job.isActive ? 'Active' : 'Closed'}
                  </div>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaBuilding className="mr-1" />
                    {job.company}
                  </div>
                  {job.location && (
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {job.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    Posted on {new Date(job.postTimestamp).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-600">
                    {job.description.length > 200
                      ? `${job.description.substring(0, 200)}...`
                      : job.description}
                  </p>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.map((skill, index) => (
                      <SkillBadge key={index} skill={skill} />
                    ))}
                    {(!job.requiredSkills || job.requiredSkills.length === 0) && (
                      <span className="text-sm text-gray-500">No specific skills listed</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Link
                    to={`/jobs/${job.jobId}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage;