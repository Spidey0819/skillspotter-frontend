// src/services/notifications.js
import api from './api';

// Get all notifications
export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  const response = await api.post(`/notifications/${notificationId}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const response = await api.post('/notifications/read-all');
  return response.data;
};