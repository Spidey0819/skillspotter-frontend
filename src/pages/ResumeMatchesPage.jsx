// src/pages/ResumeMatchesPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaBriefcase } from 'react-icons/fa';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import MatchScoreCard from '../components/jobs/MatchScoreCard';
import { getResumeById, getResumeMatches } from '../services/resumes';

const ResumeMatchesPage = () => {
  const { resumeId } = useParams();
  
  const [resume, setResume] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch resume details
        const resumeData = await getResumeById(resumeId);
        setResume(resumeData);
        
        // Fetch job matches for this resume
        const matchesData = await getResumeMatches(resumeId);
        setMatches(matchesData);
      } catch (err) {
        console.error('Error fetching resume and matches:', err);
        setError('Failed to load resume matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [resumeId]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
          <Link to="/resumes" className="flex items-center text-blue-600 hover:underline">
            <FaArrowLeft className="mr-2" /> Back to Resumes
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to={`/resumes/${resumeId}`} className="flex items-center text-blue-600 hover:underline mr-4">
            <FaArrowLeft className="mr-2" /> Back to Resume
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Job Matches for {resume?.fileName || 'Resume'}
        </h1>
        
        {matches.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <FaBriefcase className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Job Matches Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No jobs currently match the skills in this resume. Check back later as new jobs are added.
              </p>
              <Link
                to="/jobs"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse All Jobs
              </Link>
            </div>
          </Card>
        ) : (
          <div>
            <p className="text-gray-700 mb-6">
              Found {matches.length} job {matches.length === 1 ? 'match' : 'matches'} for this resume.
            </p>
            
            {matches.map((match) => (
              <MatchScoreCard key={match.matchId} match={match} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResumeMatchesPage;