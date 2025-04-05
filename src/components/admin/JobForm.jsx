// src/components/admin/JobForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Button from '../common/Button';
import Card from '../common/Card';
import SkillBadge from '../common/SkillBadge';
import Spinner from '../common/Spinner';
import { extractSkills } from '../../services/jobs';

const JobForm = ({ initialData = null, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    isActive: true,
    ...initialData
  });
  
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [extractingSkills, setExtractingSkills] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        company: initialData.company || '',
        location: initialData.location || '',
        description: initialData.description || '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
      
      if (initialData.requiredSkills && initialData.requiredSkills.length > 0) {
        setExtractedSkills(initialData.requiredSkills);
      }
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleExtractSkills = async () => {
    if (!formData.description.trim()) {
      setErrors(prev => ({ ...prev, description: 'Description is required to extract skills' }));
      return;
    }
    
    try {
      setExtractingSkills(true);
      const response = await extractSkills(formData.description);
      setExtractedSkills(response.skills || []);
    } catch (error) {
      console.error('Error extracting skills:', error);
    } finally {
      setExtractingSkills(false);
    }
  };
  
  const removeSkill = (skillToRemove) => {
    setExtractedSkills(extractedSkills.filter(skill => skill !== skillToRemove));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        requiredSkills: extractedSkills
      });
    }
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="e.g. Senior Software Engineer"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`form-input ${errors.company ? 'border-red-500' : ''}`}
            placeholder="e.g. Tech Solutions Inc."
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g. Remote, New York, NY"
          />
          <p className="mt-1 text-xs text-gray-500">Optional. Leave blank for 'Remote' or 'Various Locations'.</p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="10"
            className={`form-input ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Provide a detailed job description..."
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          
          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleExtractSkills}
              disabled={extractingSkills || !formData.description.trim()}
              className="text-sm"
            >
              {extractingSkills ? (
                <>
                  <Spinner size="sm" className="mr-2" /> Extracting Skills...
                </>
              ) : (
                'Extract Skills'
              )}
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills
          </label>
          
          {extractedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {extractedSkills.map((skill, index) => (
                <div 
                  key={index} 
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded"
                >
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className="ml-1 text-blue-700 hover:text-blue-900"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-3">
              {extractingSkills ? 'Extracting skills...' : 'No skills extracted yet. Use the "Extract Skills" button above.'}
            </p>
          )}
          
          <p className="text-xs text-gray-500">
            Skills are automatically extracted from the job description. You can remove any skills that aren't relevant.
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Post job as active (immediately visible to users)
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {initialData ? 'Update Job' : 'Create Job'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default JobForm;