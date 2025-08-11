import React from 'react';

const SideBarTeacher = ({ onSelect, selected }) => {
  return (
    <div className="sidebar">
      <button
        className={`sidebar-btn ${selected === 'create' ? 'active' : ''}`}
        onClick={() => onSelect('create')}
      >
        ➕ Create Test
      </button>
      <button
        className={`sidebar-btn ${selected === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        📋 All Tests
      </button>
      <button
        className={`sidebar-btn ${selected === 'result' ? 'active' : ''}`}
        onClick={() => onSelect('result')}
      >
        🏁 Result
      </button>

      <style>{`
        .sidebar {
          width: 200px;
          height: 100vh;
          background-color: #343a40;
          display: flex;
          flex-direction: column;
          padding: 1rem;
          box-sizing: border-box;
        }
        .sidebar-btn {
          background: none;
          border: none;
          color: white;
          padding: 12px;
          text-align: left;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 10px;
          border-radius: 5px;
          transition: background 0.2s;
        }
        .sidebar-btn:hover {
          background-color: #495057;
        }
        .sidebar-btn.active {
          background-color: #007bff;
        }
      `}</style>
    </div>
  );
};

export default SideBarTeacher;
