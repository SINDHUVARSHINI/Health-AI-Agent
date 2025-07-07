import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Layout Components
import Layout from '@components/Layout/Layout';
import ProtectedRoute from '@components/Auth/ProtectedRoute';

// Pages
import LoginPage from '@pages/Auth/LoginPage';
import RegisterPage from '@pages/Auth/RegisterPage';
import DashboardPage from '@pages/Dashboard/DashboardPage';
import ChatPage from '@pages/Chat/ChatPage';
import SymptomsPage from '@pages/Symptoms/SymptomsPage';
import MedicationsPage from '@pages/Medications/MedicationsPage';
import AppointmentsPage from '@pages/Appointments/AppointmentsPage';
import HealthMetricsPage from '@pages/HealthMetrics/HealthMetricsPage';
import ProfilePage from '@pages/Profile/ProfilePage';
import EducationPage from '@pages/Education/EducationPage';
import SupportPage from '@pages/Support/SupportPage';
import NotFoundPage from '@pages/NotFoundPage';

// Context
import { useAuth } from '@contexts/AuthContext';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Add debugging
  console.log('App render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Health AI Agent - Cancer Patient Support</title>
        <meta name="description" content="AI-powered health assistant for cancer patients" />
      </Helmet>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/chat" element={
          <ProtectedRoute>
            <Layout>
              <ChatPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/symptoms" element={
          <ProtectedRoute>
            <Layout>
              <SymptomsPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/medications" element={
          <ProtectedRoute>
            <Layout>
              <MedicationsPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/appointments" element={
          <ProtectedRoute>
            <Layout>
              <AppointmentsPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/health-metrics" element={
          <ProtectedRoute>
            <Layout>
              <HealthMetricsPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/education" element={
          <ProtectedRoute>
            <Layout>
              <EducationPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/support" element={
          <ProtectedRoute>
            <Layout>
              <SupportPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App; 