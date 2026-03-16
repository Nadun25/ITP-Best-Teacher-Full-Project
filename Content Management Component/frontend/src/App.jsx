import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentLibrary from './pages/StudentLibrary';
import UploadForm from './pages/UploadForm';
import EditMaterial from './pages/EditMaterial';
import MaterialViewer from './pages/MaterialViewer';

import axios from 'axios';

function App() {
  // Simulating auth state for the purpose of this component
  const [user, setUser] = useState({
    id: '65f123456789012345678901', // Default to Teacher ID for demo
    name: 'Dr. Smith',
    role: 'teacher' 
  });

  // Global Axios configuration to handle mock auth
  React.useEffect(() => {
    const interceptor = axios.interceptors.request.use(config => {
      const token = user.role === 'teacher' ? 'mock-teacher-token' : 'mock-student-token';
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor);
  }, [user.role]);

  // Redirect on role change if necessary
  React.useEffect(() => {
    if (user.role === 'teacher' && window.location.pathname === '/library') {
      // Teachers can stay in library or go to dashboard
    }
    if (user.role === 'student' && window.location.pathname === '/dashboard') {
      // Students must be redirected from dashboard
      window.location.href = '/library';
    }
  }, [user.role]);

  return (
    <Router>
      <div className="app-shell">
        <Header user={user} setUser={setUser} />
        <main className="container mt-4 animate-fade-in" style={{ paddingBottom: '4rem' }}>
          <Routes>
            <Route path="/" element={<Navigate to={user.role === 'teacher' ? '/dashboard' : '/library'} />} />
            <Route path="/dashboard" element={<TeacherDashboard user={user} />} />
            <Route path="/library" element={<StudentLibrary />} />
            <Route path="/upload" element={<UploadForm />} />
            <Route path="/edit/:id" element={<EditMaterial />} />
            <Route path="/material/:id" element={<MaterialViewer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
