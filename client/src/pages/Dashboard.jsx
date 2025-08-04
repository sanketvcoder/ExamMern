import React from 'react';
import Navbar from '../component/Navbar';
import SideBar from '../component/SideBar';
import Assessment from '../component/Assessment';


const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <SideBar />
        <div className="dashboard-content">
          <Assessment />
        </div>
      </div>

      {/* Inline CSS below */}
      <style jsx>{`
        .dashboard-container {
          display: flex;
          width: 100%;
          height: 100vh;
          background-color: #f5f5f5;
        }

        .dashboard-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
      `}</style>
    </>
  );
};

export default Dashboard;
