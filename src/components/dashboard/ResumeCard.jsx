// src/components/dashboard/ResumeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaFilePdf, FaFileWord, FaDownload, FaEye, FaTrash } from 'react-icons/fa';

const ResumeCard = ({ resume, onDownload, onDelete }) => {
  const getFileIcon = () => {
    if (!resume) return <FaFileAlt className="text-gray-400" />;
    
    const fileType = resume.fileType?.toLowerCase();
    if (fileType === 'pdf') return <FaFilePdf className="text-red-500" />;
    if (['doc', 'docx'].includes(fileType)) return <FaFileWord className="text-blue-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };
  
  if (!resume) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex items-center mb-3">
          <div className="mr-3">
            {getFileIcon()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{resume.fileName}</h3>
            <p className="text-sm text-gray-500">Uploaded on {new Date(resume.uploadTimestamp).toLocaleDateString()}</p>
          </div>
        </div>
        
        {resume.extractedSkills && resume.extractedSkills.length > 0 && (
          <div className="mt-3 mb-4">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Skills:</span> {resume.extractedSkills.length} detected
            </p>
            <div className="flex flex-wrap gap-1">
              {resume.extractedSkills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
              {resume.extractedSkills.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  +{resume.extractedSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <div className="flex items-center">
            <button 
              className="mr-2 text-sm text-gray-600 hover:text-blue-600 flex items-center"
              onClick={() => onDownload && onDownload(resume)}
            >
              <FaDownload className="mr-1" size={14} />
              Download
            </button>
            
            <button 
              className="text-sm text-gray-600 hover:text-red-600 flex items-center"
              onClick={() => onDelete && onDelete(resume)}
            >
              <FaTrash className="mr-1" size={14} />
              Delete
            </button>
          </div>
          
          <Link 
            to={`/resumes/${resume.resumeId}`}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaEye className="mr-1" size={14} />
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;