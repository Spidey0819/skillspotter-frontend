// src/services/jobs.js
import api from './api';

// Get all jobs
export const getAllJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

// Get job by ID
export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

// Get job matches for a user
export const getJobMatches = async () => {
  const response = await api.get('/user/job-matches');
  return response.data;
};

// Get specific job match details
export const getJobMatchDetails = async (jobId) => {
  const response = await api.get(`/user/job-matches/${jobId}`);
  return response.data;
};

// Extract skills from text
export const extractSkills = async (text) => {
  const response = await api.post('/jobs/extract-skills', { text });
  return response.data;
};

// For admin: Create a new job
export const createJob = async (jobData) => {
  const response = await api.post('/admin/jobs', jobData);
  return response.data;
};

// For admin: Update a job
export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/admin/jobs/${jobId}`, jobData);
  return response.data;
};

// For admin: Toggle job active status
export const toggleJobStatus = async (jobId) => {
  const response = await api.post(`/admin/jobs/${jobId}/toggle`);
  return response.data;
};

// For admin: Get job candidates
export const getJobCandidates = async (jobId) => {
  const response = await api.get(`/admin/jobs/${jobId}/candidates`);
  return response.data;
};