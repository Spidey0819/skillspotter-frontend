// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Layout from './components/common/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import ResumesPage from './pages/ResumesPage';
import ResumeDetailPage from './pages/ResumeDetailPage';
import ResumeMatchesPage from './pages/ResumeMatchesPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import NotificationsPage from './pages/Notifications';
import ProfilePage from './pages/Profile';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/Dashboard';
import AdminJobsPage from './pages/admin/JobsPage';
import AdminPostJobPage from './pages/admin/PostJob';

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Auth routes */}
            <Route path="/login" element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            } />
            
            <Route path="/register" element={
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            } />
            
            {/* User routes */}
            <Route path="/dashboard" element={
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            } />
            
            <Route path="/profile" element={
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            } />
            
            <Route path="/resumes/upload" element={
              <DashboardLayout>
                <ResumeUploadPage />
              </DashboardLayout>
            } />
            
            <Route path="/resumes" element={
              <DashboardLayout>
                <ResumesPage />
              </DashboardLayout>
            } />
            
            <Route path="/resumes/:resumeId" element={
              <DashboardLayout>
                <ResumeDetailPage />
              </DashboardLayout>
            } />
            
            <Route path="/resumes/:resumeId/matches" element={
              <DashboardLayout>
                <ResumeMatchesPage />
              </DashboardLayout>
            } />
            
            <Route path="/jobs" element={
              <DashboardLayout>
                <JobsPage />
              </DashboardLayout>
            } />
            
            <Route path="/jobs/:jobId" element={
              <DashboardLayout>
                <JobDetailPage />
              </DashboardLayout>
            } />
            
            <Route path="/notifications" element={
              <DashboardLayout>
                <NotificationsPage />
              </DashboardLayout>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/jobs" element={<AdminJobsPage />} />
            <Route path="/admin/jobs/create" element={<AdminPostJobPage />} />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;