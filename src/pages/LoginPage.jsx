// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Log In to SkillSpotter</h2>
      <LoginForm />
    </div>
  );
};

export default LoginPage;