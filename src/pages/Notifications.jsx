// src/pages/Notifications.jsx
import React, { useEffect } from 'react';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import NotificationItem from '../components/dashboard/NotificationItem';
import { useNotifications } from '../context/NotificationContext';

const NotificationsPage = () => {
  const { notifications, unreadCount, loading, fetchNotifications, markAllAsRead } = useNotifications();
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <FaBell className="text-blue-600 mr-3 h-6 w-6" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleMarkAllAsRead}
          >
            <FaCheckDouble className="mr-1" />
            Mark all as read
          </Button>
        )}
      </div>
      
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any notifications yet. They will appear here when you have new job matches or updates.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationItem key={notification.notificationId} notification={notification} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationsPage;