// src/components/resume/ResumeUploader.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaUpload, FaFile, FaFileAlt, FaFileWord, FaFilePdf } from 'react-icons/fa';

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const navigate = useNavigate();

  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/rtf'];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('File type not allowed. Please upload PDF, DOC, DOCX, TXT, or RTF file.');
        setFile(null);
        return;
      }
      
      // Validate file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File too large. Maximum file size is 5MB.');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const getFileIcon = () => {
    if (!file) return <FaFileAlt className="text-gray-400" size={48} />;
    
    const fileType = file.type;
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500" size={48} />;
    if (fileType.includes('word') || fileType.includes('docx') || fileType.includes('doc')) return <FaFileWord className="text-blue-500" size={48} />;
    return <FaFile className="text-gray-500" size={48} />;
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    // Create form data
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setUploadResult(response.data);
      setTimeout(() => {
        navigate('/resumes');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Resume upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload Your Resume</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-semibold">Resume uploaded successfully!</p>
          {uploadResult && (
            <div className="mt-2">
              <p>Extracted {uploadResult.skills?.length || 0} skills from your resume.</p>
              {uploadResult.matches > 0 && (
                <p>Found {uploadResult.matches} potential job matches!</p>
              )}
            </div>
          )}
          <p className="mt-2">Redirecting to your resumes page...</p>
        </div>
      )}
      
      <div className="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <input
          type="file"
          id="resumeFile"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx,.txt,.rtf"
        />
        
        <div className="flex flex-col items-center justify-center">
          {getFileIcon()}
          
          <div className="mt-4">
            {file ? (
              <div className="text-center">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <p className="text-gray-500">Drag and drop your resume file here, or click to browse</p>
            )}
          </div>
          
          <button
            type="button"
            className="mt-4 btn btn-primary flex items-center"
            onClick={() => fileInputRef.current.click()}
          >
            <FaUpload className="mr-2" />
            {file ? 'Change File' : 'Select File'}
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Supported Formats</h3>
        <p className="text-gray-600">
          PDF, DOC, DOCX, TXT, and RTF files are supported. Maximum file size is 5MB.
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">What happens next?</h3>
        <p className="text-gray-600">
          We'll analyze your resume to extract your skills and experience, then match you with relevant job opportunities.
        </p>
      </div>
      
      <button
        type="button"
        className="w-full btn btn-primary"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? 'Uploading...' : 'Upload Resume'}
      </button>
    </div>
  );
};

export default ResumeUploader;