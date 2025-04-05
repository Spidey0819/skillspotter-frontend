import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ 
  title, 
  icon: Icon, 
  count, 
  description, 
  linkTo, 
  linkText, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-50'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      hover: 'hover:bg-green-50'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      hover: 'hover:bg-purple-50'
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      hover: 'hover:bg-orange-50'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      hover: 'hover:bg-red-50'
    }
  };
  
  const colors = colorClasses[color] || colorClasses.blue;
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow ${colors.hover} hover:shadow-lg`}>
      <div className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${colors.bg} ${colors.text} mr-4`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-baseline">
              {count !== undefined && (
                <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
              )}
              <p className="ml-2 text-sm font-medium text-gray-600">{title}</p>
            </div>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
      </div>
      
      {linkTo && linkText && (
        <Link 
          to={linkTo} 
          className={`block px-6 py-3 text-sm font-medium text-center border-t border-gray-200 ${colors.text}`}
        >
          {linkText}
        </Link>
      )}
    </div>
  );
};

export default DashboardCard;