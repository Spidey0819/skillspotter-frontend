// src/components/common/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  title, 
  footer,
  ...props 
}) => {
  return (
    <div 
      className={`bg-white shadow-md rounded-lg ${className}`}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;