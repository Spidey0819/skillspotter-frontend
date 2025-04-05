// src/components/jobs/MatchScoreCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import SkillBadge from '../common/SkillBadge';

const MatchScoreCard = ({ match }) => {
  if (!match || !match.job) {
    return null;
  }

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="mb-2 md:mb-0">
          <h3 className="text-lg font-semibold text-gray-900">{match.job.title}</h3>
          <p className="text-gray-600">{match.job.company}</p>
        </div>
        <div className="flex items-center">
          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${match.matchScore}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-blue-700">{match.matchScore}% Match</span>
        </div>
      </div>
      
      {match.matchingSkills && match.matchingSkills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Matching Skills:</h4>
          <div className="flex flex-wrap gap-1">
            {match.matchingSkills.slice(0, 5).map((skill, index) => (
              <SkillBadge key={index} skill={skill} size="sm" variant="success" />
            ))}
            {match.matchingSkills.length > 5 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{match.matchingSkills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="text-right">
        <Link
          to={`/jobs/${match.jobId}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View Details
          <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </Link>
      </div>
    </Card>
  );
};

export default MatchScoreCard;