import React from 'react';

const SkillBadge = ({ 
  skill, 
  className = '', 
  size = 'md', 
  variant = 'default',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };
  
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-indigo-100 text-indigo-800',
    neutral: 'bg-gray-100 text-gray-800'
  };
  
  const badgeClasses = `inline-flex items-center rounded-full font-medium 
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.default}
    ${className}`;
  
  return (
    <span 
      className={badgeClasses}
      {...props}
    >
      {skill}
    </span>
  );
};

export default SkillBadge;