// src/services/resumes.js
import api, { createApi } from './api';
import { config, initializeConfig } from './config';

// Create reusable API requests
const getResumesRequest = createApi('get', '/resumes');
const getResumeByIdRequest = createApi('get', '/resumes/');
const deleteResumeRequest = createApi('delete', '/resumes/');
const getResumeSkillsRequest = createApi('get', '/resumes/');
const getResumeMatchesRequest = createApi('get', '/resumes/');

// Get all user resumes
export const getUserResumes = async () => {
  const token = localStorage.getItem('token');
  return getResumesRequest(null, {
    Authorization: `Bearer ${token}`
  });
};

// Get resume by ID
export const getResumeById = async (resumeId) => {
  const token = localStorage.getItem('token');
  return getResumeByIdRequest(resumeId, {
    Authorization: `Bearer ${token}`
  });
};

// Upload a resume - special handling for file uploads
export const uploadResume = async (formData) => {
  // Ensure config is initialized
  await initializeConfig();
  
  // Get authenticated API
  const apiInstance = await api.post('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  return apiInstance.data;
};

// Download a resume
export const downloadResume = async (resumeId) => {
  // Ensure config is initialized
  await initializeConfig();
  
  const response = await api.get(`/resumes/${resumeId}/download`, {
    responseType: 'blob',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  return response.data;
};

// Delete a resume
export const deleteResume = async (resumeId) => {
  const token = localStorage.getItem('token');
  return deleteResumeRequest(resumeId, {
    Authorization: `Bearer ${token}`
  });
};

// Get resume skills
export const getResumeSkills = async (resumeId) => {
  const token = localStorage.getItem('token');
  return getResumeSkillsRequest(`${resumeId}/skills`, {
    Authorization: `Bearer ${token}`
  });
};

// Get job matches for a resume
export const getResumeMatches = async (resumeId) => {
  const token = localStorage.getItem('token');
  return getResumeMatchesRequest(`${resumeId}/matches`, {
    Authorization: `Bearer ${token}`
  });
};