// src/pages/ResumesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import SkillBadge from '../components/common/SkillBadge';
import { getUserResumes } from '../services/resumes';
import { useNotifications } from '../context/NotificationContext';
import { FaUpload, FaDownload, FaTrash, FaSearch, FaFileAlt, FaFilePdf, FaFileWord } from 'react-icons/fa';
import axios from 'axios';

const ResumesPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useNotifications();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const data = await getUserResumes();
        setResumes(data);
      } catch (err) {
        setError('Failed to load resumes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleDelete = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      setDeletingId(resumeId);
      
      // Direct DELETE request instead of using service
      await axios.delete(`http://localhost:5000/api/resumes/${resumeId}`, {
        withCredentials: true
      });
      
      setResumes(resumes.filter((resume) => resume.resumeId !== resumeId));
      showToast('Resume deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting resume:', err);
      showToast('Failed to delete resume', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (resumeId, fileName) => {
    try {
      // Use direct API endpoint
      const response = await axios.get(`http://localhost:5000/api/resumes/${resumeId}/download`, {
        responseType: 'blob',
        withCredentials: true
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast('Resume downloaded successfully', 'success');
    } catch (err) {
      console.error('Error downloading resume:', err);
      showToast('Failed to download resume', 'error');
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'pdf') return <FaFilePdf className="text-red-500" />;
    if (['doc', 'docx'].includes(fileType)) return <FaFileWord className="text-blue-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Your Resumes</h1>
        <Link to="/resumes/upload" className="btn bg-blue-600 text-white hover:bg-blue-700 flex items-center">
          <FaUpload className="mr-2" />
          Upload Resume
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {resumes.length === 0 ? (
        <Card className="text-center py-12">
          <FaFileAlt className="text-gray-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Resumes Found</h2>
          <p className="text-gray-600 mb-6">
            Upload your resume to start matching with jobs
          </p>
          <Link to="/resumes/upload" className="btn bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center">
            <FaUpload className="mr-2" />
            Upload Your First Resume
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.resumeId} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {getFileIcon(resume.fileType)}
                    <h3 className="text-lg font-semibold ml-2">{resume.fileName}</h3>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(resume.uploadTimestamp).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Skills detected:</strong> {resume.extractedSkills?.length || 0}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resume.extractedSkills?.slice(0, 5).map((skill, index) => (
                      <SkillBadge key={index} skill={skill} size="sm" />
                    ))}
                    {resume.extractedSkills?.length > 5 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{resume.extractedSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <button
                      onClick={() => handleDownload(resume.resumeId, resume.fileName)}
                      className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center mr-3"
                    >
                      <FaDownload className="mr-1" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(resume.resumeId)}
                      className="text-red-600 hover:text-red-800 text-sm inline-flex items-center"
                      disabled={deletingId === resume.resumeId}
                    >
                      {deletingId === resume.resumeId ? (
                        <>
                          <Spinner size="sm" className="mr-1" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <FaTrash className="mr-1" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center">
                    <Link
                      to={`/resumes/${resume.resumeId}`}
                      className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center mr-3"
                    >
                      <FaFileAlt className="mr-1" />
                      View
                    </Link>
                    <Link
                      to={`/resumes/${resume.resumeId}/matches`}
                      className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                    >
                      <FaSearch className="mr-1" />
                      Matches
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumesPage;