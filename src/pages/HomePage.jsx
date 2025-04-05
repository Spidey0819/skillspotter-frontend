// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { FaSearch, FaFileAlt, FaBriefcase, FaBell, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { currentUser, loading } = useAuth();
  
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Job Match with AI
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              SkillSpotter uses AI to analyze your resume and match you with the most suitable job opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!loading && !currentUser ? (
                // Show registration/login buttons for logged out users
                <>
                  <Link
                    to="/register"
                    className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="btn bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 text-lg font-medium"
                  >
                    Log In
                  </Link>
                </>
              ) : (
                // Show dashboard button for logged in users
                <Link
                  to="/dashboard"
                  className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
                >
                  Go to Dashboard <FaArrowRight className="inline ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              In just a few simple steps, SkillSpotter helps connect you with your dream job
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <FaFileAlt className="text-blue-600 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
              <p className="text-gray-600">
                Upload your resume and our AI will extract your skills and experience.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <FaSearch className="text-blue-600 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
              <p className="text-gray-600">
                Our algorithm analyzes your skills and matches you with the most suitable jobs.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <FaBell className="text-blue-600 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Notified</h3>
              <p className="text-gray-600">
                Receive notifications when new job opportunities match your profile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              SkillSpotter offers a range of features to help you find and land your dream job
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Skill Extraction</h3>
              <p className="text-gray-600">
                Our AI technology accurately identifies and extracts your skills from your resume.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Smart Job Matching</h3>
              <p className="text-gray-600">
                Get matched with job opportunities that align with your unique skill set.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Skill Gap Analysis</h3>
              <p className="text-gray-600">
                Identify skills you may need to develop to qualify for your target positions.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Job Recommendations</h3>
              <p className="text-gray-600">
                Receive personalized job recommendations based on your profile.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Resume Management</h3>
              <p className="text-gray-600">
                Manage multiple resumes and track which ones receive the best matches.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Real-time Notifications</h3>
              <p className="text-gray-600">
                Get instant alerts when new jobs matching your skills are posted.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Job?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            {currentUser 
              ? "Upload your resume and start matching with jobs that suit your skills!"
              : "Create an account now and start matching with jobs that suit your skills and experience."}
          </p>
          {!loading && !currentUser ? (
            <Link
              to="/register"
              className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
            >
              Get Started Now
            </Link>
          ) : (
            <Link
              to="/resumes/upload"
              className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
            >
              Upload Your Resume
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;