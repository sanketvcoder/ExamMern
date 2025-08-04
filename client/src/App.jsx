import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import React from 'react';
import Login from './pages/login';
import Signup from './pages/sign';
import Dashboard from './pages/Dashboard';
import ShowProfile from './pages/showProfile';
import AdminDashboard from './pages/adminDashboard';
import TeacherDashboard from './pages/teacherDashboard';
import TestInfo from './component/TestInfo';
import Navbar from './component/Navbar';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard/>} />
        <Route path="/test-info/:testId" element={<TestInfo />} />

        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/show-profile" element={<ShowProfile/>} />
        <Route path='/profile' element={<ShowProfile/>} />
      </Routes>
    </Router>
  )
}

export default App
