// src/pages/RegisterPage.jsx
import React from 'react';
import Layout from '../components/common/Layout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default RegisterPage;
