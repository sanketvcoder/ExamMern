import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Login from './pages/login';
import Signup from './pages/sign';
import Dashboard from './pages/Dashboard';
import ShowProfile from './pages/showProfile';
import AdminDashboard from './pages/adminDashboard';
import TeacherDashboard from './pages/teacherDashboard';
import TestInfo from './component/TestInfo';
import StudentTest from './component/StudentTest';
import TestSecurity from './component/TestSecurity';
import Rules from './component/Rules';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/test-info/:testId" element={<TestInfo />} />

        <Route path="/show-profile" element={<ShowProfile />} />
        <Route path="/profile" element={<ShowProfile />} />

        {/* New test routes */}
        <Route path="/dashboard/test/security/:testId" element={<TestSecurity />} />
        <Route path="/dashboard/test/start/:testId" element={<StudentTest />} />

        <Route path="/dashboard/test/start/rule" element={<Rules/>} />
      </Routes>
    </Router>
  );
}

export default App;
