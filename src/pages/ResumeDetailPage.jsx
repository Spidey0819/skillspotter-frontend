// src/pages/ResumeDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaEye, FaTrash } from 'react-icons/fa';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import SkillBadge from '../components/common/SkillBadge';
import { getResumeById, deleteResume, downloadResume } from '../services/resumes';
import { useNotifications } from '../context/NotificationContext';
import { formatDate, formatFileSize } from '../utils/formatters';

const ResumeDetailPage = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const data = await getResumeById(resumeId);
        setResume(data);
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Failed to load resume details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResume();
  }, [resumeId]);
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteResume(resumeId);
      showToast('Resume deleted successfully', 'success');
      navigate('/resumes');
    } catch (err) {
      console.error('Error deleting resume:', err);
      showToast('Failed to delete resume', 'error');
      setIsDeleting(false);
    }
  };
  
  const handleDownload = async () => {
    try {
      const blob = await downloadResume(resumeId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = resume.fileName;
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
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
          <Link to="/resumes" className="flex items-center text-blue-600 hover:underline">
            <FaArrowLeft className="mr-2" /> Back to Resumes
          </Link>
        </div>
      </Layout>
    );
  }
  
  if (!resume) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p>Resume not found.</p>
          </div>
          <Link to="/resumes" className="flex items-center text-blue-600 hover:underline">
            <FaArrowLeft className="mr-2" /> Back to Resumes
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/resumes" className="flex items-center text-blue-600 hover:underline mb-6">
          <FaArrowLeft className="mr-2" /> Back to Resumes
        </Link>
        
        <Card>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{resume.fileName}</h1>
              <div className="text-sm text-gray-600">
                <p>Uploaded on {formatDate(resume.uploadTimestamp)}</p>
                <p>File type: {resume.fileType.toUpperCase()}</p>
              </div>
            </div>
            
            <div className="flex mt-4 md:mt-0">
              <Button
                variant="outline"
                className="mr-2 flex items-center"
                onClick={handleDownload}
              >
                <FaDownload className="mr-1" />
                Download
              </Button>
              
              <Button
                variant="danger"
                className="flex items-center"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                <FaTrash className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Extracted Skills</h2>
            {resume.extractedSkills && resume.extractedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resume.extractedSkills.map((skill, index) => (
                  <SkillBadge key={index} skill={skill} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No skills extracted from this resume.</p>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <Link
              to={`/resumes/${resumeId}/matches`}
              className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center"
            >
              <FaEye className="mr-1" />
              View Job Matches
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ResumeDetailPage;