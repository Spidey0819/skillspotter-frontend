// src/components/dashboard/JobMatchCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import SkillBadge from '../common/SkillBadge';

const JobMatchCard = ({ match }) => {
  if (!match || !match.job) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 md:mb-0 md:mr-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{match.job.title}</h3>
            
            <div className="flex flex-wrap text-sm text-gray-500 mb-3">
              <div className="flex items-center mr-4 mb-2">
                <FaBuilding className="mr-1" />
                <span>{match.job.company}</span>
              </div>
              
              {match.job.location && (
                <div className="flex items-center mr-4 mb-2">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{match.job.location}</span>
                </div>
              )}
              
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="mr-1" />
                <span>
                  Posted on {new Date(match.job.postTimestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center">
                <div className="mr-2 font-semibold text-blue-700">{match.matchScore}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-xs">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${match.matchScore}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500">match</div>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Link 
              to={`/jobs/${match.jobId}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
        
        {match.matchingSkills && match.matchingSkills.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Matching Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {match.matchingSkills.map((skill, index) => (
                <SkillBadge key={index} skill={skill} variant="success" size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatchCard;