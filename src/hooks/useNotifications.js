import { useState, useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import axios from 'axios';
import { API_URL } from '../api';

const useNotifications = () => {
  const context = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  const { notifications, setNotifications, unreadCount, setUnreadCount } = context;

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/notifications`);
      setNotifications(response.data);
      const unreadNotifications = response.data.filter(notification => !notification.read);
      setUnreadCount(unreadNotifications.length);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/api/notifications/${notificationId}/read`);
      // Update local state
      const updatedNotifications = notifications.map(notification => {
        if (notification.notificationId === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      setNotifications(updatedNotifications);
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/api/notifications/read-all`);
      // Update local state
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};

export default useNotifications;