// src/components/dashboard/SkillsDisplay.jsx
import React from 'react';

const SkillsDisplay = ({ skills, title = "Skills" }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-500">No skills to display</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsDisplay;