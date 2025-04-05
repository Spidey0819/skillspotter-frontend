// src/pages/admin/Jobs.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { FaPlus, FaSearch, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { getAllJobs, toggleJobStatus } from '../../services/jobs';
import { useNotifications } from '../../context/NotificationContext';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toggleLoading, setToggleLoading] = useState(null); // Stores the job ID that's currently toggling
  const { showToast } = useNotifications();

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleStatus = async (jobId) => {
    try {
      setToggleLoading(jobId);
      const updatedJob = await toggleJobStatus(jobId);
      
      // Update jobs list with the toggled job
      setJobs(jobs.map(job => 
        job.jobId === jobId ? updatedJob : job
      ));
      
      showToast(`Job status updated successfully`, 'success');
    } catch (err) {
      showToast('Failed to update job status', 'error');
      console.error(err);
    } finally {
      setToggleLoading(null);
    }
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Display loading or error states
  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
          <Link to="/admin/jobs/create" className="btn bg-blue-600 text-white hover:bg-blue-700 flex items-center">
            <FaPlus className="mr-2" />
            Create Job
          </Link>
        </div>

        <Card className="mb-6">
          <div className="flex items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </Card>

        {filteredJobs.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">No jobs found</p>
          </Card>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.jobId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{job.location || 'Remote'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(job.postTimestamp).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex items-center justify-center space-x-3">
                        <Link to={`/admin/jobs/${job.jobId}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                        <Link to={`/admin/jobs/${job.jobId}/edit`} className="text-blue-600 hover:text-blue-900">
                          Edit
                        </Link>
                        <button 
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          onClick={() => handleToggleStatus(job.jobId)}
                          disabled={toggleLoading === job.jobId}
                        >
                          {toggleLoading === job.jobId ? (
                            <Spinner size="sm" className="mr-1" />
                          ) : job.isActive ? (
                            <FaToggleOn className="mr-1" />
                          ) : (
                            <FaToggleOff className="mr-1" />
                          )}
                          {job.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default JobsPage;