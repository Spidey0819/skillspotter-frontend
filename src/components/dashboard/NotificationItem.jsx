// src/components/dashboard/NotificationItem.jsx
import React from 'react';
import { FaBell, FaCheck, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationContext';

const NotificationItem = ({ notification }) => {
  const { markAsRead } = useNotifications();
  
  const handleMarkAsRead = () => {
    if (!notification.read) {
      markAsRead(notification.notificationId);
    }
  };
  
  // Format date as relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <div 
      className={`p-4 border-b last:border-b-0 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          {notification.read ? (
            <FaEnvelopeOpen className="h-5 w-5 text-gray-400" />
          ) : (
            <FaEnvelope className="h-5 w-5 text-blue-500" />
          )}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <p className={`text-sm font-medium ${notification.read ? 'text-gray-900' : 'text-blue-800'}`}>
              {notification.subject}
            </p>
            <p className="text-xs text-gray-500">
              {formatRelativeTime(notification.createdAt)}
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          
          {!notification.read && (
            <button 
              className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notification.notificationId);
              }}
            >
              <FaCheck className="mr-1" />
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;