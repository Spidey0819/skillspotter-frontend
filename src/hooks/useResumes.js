import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api';

const useResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/resumes`);
      setResumes(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch resumes');
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getResumeById = async (resumeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/resumes/${resumeId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch resume details');
      console.error('Error fetching resume details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async (file) => {
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      const response = await axios.post(
        `${API_URL}/api/resumes/upload`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload resume');
      console.error('Error uploading resume:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (resumeId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/api/resumes/${resumeId}`);
      setResumes(resumes.filter(resume => resume.resumeId !== resumeId));
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete resume');
      console.error('Error deleting resume:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    resumes,
    loading,
    error,
    uploadProgress,
    fetchResumes,
    getResumeById,
    uploadResume,
    deleteResume
  };
};

export default useResumes;