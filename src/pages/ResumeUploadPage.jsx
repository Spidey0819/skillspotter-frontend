// src/pages/ResumeUploadPage.jsx
import React from 'react';
import Layout from '../components/common/Layout';
import ResumeUploader from '../components/resume/ResumeUploader';

const ResumeUploadPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Upload Resume</h1>
        <ResumeUploader />
      </div>
    </Layout>
  );
};

export default ResumeUploadPage;