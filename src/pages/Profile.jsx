// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Profile = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Email is invalid';
    }
    
    return errors;
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateProfileForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setUpdating(true);
    
    try {
      await updateProfile(profileData);
      showToast('Profile updated successfully', 'success');
      setErrors({});
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update profile', 'error');
      if (err.response?.data?.error === 'Email already taken') {
        setErrors({ email: 'Email is already in use' });
      }
    } finally {
      setUpdating(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validatePasswordForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setChangingPassword(true);
    
    try {
      await updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showToast('Password updated successfully', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update password', 'error');
      if (err.response?.data?.error === 'Current password is incorrect') {
        setErrors({ currentPassword: 'Current password is incorrect' });
      }
    } finally {
      setChangingPassword(false);
    }
  };
  
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        navigate('/login');
      } catch (err) {
        showToast('Failed to logout. Please try again.', 'error');
      }
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-xl font-semibold">{currentUser?.name}</h2>
              <p className="text-gray-600">{currentUser?.email}</p>
              <p className="text-gray-500 text-sm mt-1 mb-4 capitalize">{currentUser?.role || 'user'}</p>
              
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <Button
                type="submit"
                isLoading={updating}
              >
                Update Profile
              </Button>
            </form>
          </Card>
          
          <Card>
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${errors.currentPassword ? 'border-red-500' : ''}`}
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${errors.newPassword ? 'border-red-500' : ''}`}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
              
              <Button
                type="submit"
                isLoading={changingPassword}
              >
                Change Password
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;