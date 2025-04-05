import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api';

const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/jobs`);
      setJobs(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getJobById = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/jobs/${jobId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch job details');
      console.error('Error fetching job details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    getJobById
  };
};

export default useJobs;