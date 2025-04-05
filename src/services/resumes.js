// src/services/resumes.js
import api from './api';

// Get all user resumes
export const getUserResumes = async () => {
  const response = await api.get('/resumes');
  return response.data;
};

// Get resume by ID
export const getResumeById = async (resumeId) => {
  const response = await api.get(`/resumes/${resumeId}`);
  return response.data;
};

// Upload a resume
export const uploadResume = async (formData) => {
  const response = await api.post('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Download a resume
export const downloadResume = async (resumeId) => {
  const response = await api.get(`/resumes/${resumeId}/download`, {
    responseType: 'blob'
  });
  return response.data;
};

// Delete a resume
export const deleteResume = async (resumeId) => {
  const response = await api.delete(`/resumes/${resumeId}`);
  return response.data;
};

// Get resume skills
export const getResumeSkills = async (resumeId) => {
  const response = await api.get(`/resumes/${resumeId}/skills`);
  return response.data;
};

// Get job matches for a resume
export const getResumeMatches = async (resumeId) => {
  const response = await api.get(`/resumes/${resumeId}/matches`);
  return response.data;
};