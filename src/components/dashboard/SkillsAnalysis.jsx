import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../api';

const SkillsAnalysis = ({ resumeId }) => {
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkillsAnalysis = async () => {
      if (!resumeId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/resumes/${resumeId}/skills`);
        setSkillsData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch skills analysis');
        console.error('Error fetching skills analysis:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsAnalysis();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!skillsData || !skillsData.skills || skillsData.skills.length === 0) {
    return (
      <div className="bg-gray-100 text-gray-700 px-4 py-5 rounded text-center">
        <p>No skills detected in this resume.</p>
      </div>
    );
  }

  // Determine skill categories
  const categories = {
    programmingLanguages: ['python', 'java', 'javascript', 'c++', 'c#', 'typescript', 'kotlin', 'perl'],
    webTechnologies: ['html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask'],
    databases: ['sql', 'mysql', 'postgresql', 'mongodb', 'nosql', 'oracle', 'redis', 'elasticsearch'],
    cloudServices: ['aws', 'azure', 'gcp', 'docker', 'kubernetes'],
    tools: ['git', 'jenkins', 'terraform', 'jira', 'ci/cd', 'devops'],
    dataSkills: ['machine learning', 'deep learning', 'ai', 'data science', 'data analysis', 'tableau', 'power bi', 'spark', 'hadoop', 'kafka'],
    softSkills: ['project management', 'leadership', 'communication', 'teamwork', 'agile', 'scrum'],
    other: []
  };

  // Categorize skills
  const categorizedSkills = {};
  
  for (const category in categories) {
    categorizedSkills[category] = [];
  }
  
  skillsData.skills.forEach(skill => {
    let found = false;
    
    for (const category in categories) {
      if (categories[category].includes(skill.toLowerCase())) {
        categorizedSkills[category].push(skill);
        found = true;
        break;
      }
    }
    
    if (!found) {
      categorizedSkills.other.push(skill);
    }
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Skills Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(categorizedSkills).map(([category, skills]) => {
          if (skills.length === 0) return null;
          
          return (
            <div key={category} className="border border-gray-200 rounded p-3">
              <h3 className="font-bold text-gray-700 mb-2 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
        <h3 className="font-bold text-blue-800 mb-2">Skill Statistics</h3>
        <p className="text-sm">
          <span className="font-medium">Total Skills:</span> {skillsData.skills.length}
        </p>
        <p className="text-sm">
          <span className="font-medium">Top Categories:</span> {
            Object.entries(categorizedSkills)
              .filter(([category, skills]) => skills.length > 0)
              .sort((a, b) => b[1].length - a[1].length)
              .slice(0, 2)
              .map(([category]) => category.replace(/([A-Z])/g, ' $1').trim())
              .join(', ')
          }
        </p>
      </div>
    </div>
  );
};

export default SkillsAnalysis;