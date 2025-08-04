import React, { useState } from 'react';
import CreateTestForm from './CreateTestForm';
import SideBarTeacher from '../component/SideBarTeacher';
import AllTests from '../component/AllTest';
import Navbar from '../component/Navbar';



const TeacherDashboard = () => {
  const [view, setView] = useState('create');

  return (
    <>
    <Navbar/>
    <div className="dashboard-container">
      <SideBarTeacher onSelect={setView} selected={view} />
      <div className="main-content">
        {view === 'create' && <CreateTestForm />}
        {view === 'all' && <AllTests />}
      </div>

      <style>{`
        .dashboard-container {
          display: flex;
          height: 100vh;
        }
        .main-content {
          flex: 1;
          overflow-y: auto;
        }
      `}</style>
    </div>
    </>
  );
};

export default TeacherDashboard;
