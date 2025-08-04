import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Rules = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const testId = location.state?.testId;

  const handleStart = async () => {
    try {
      // Attempt to request fullscreen before navigation
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn('Could not enter fullscreen:', err);
    }

    // Navigate to the test
    if (testId) {
      navigate(`/dashboard/test/start/${testId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.content}>
        <h2 style={styles.title}>📋 Test Rules</h2>
        <ol style={styles.rulesList}>
          <li>Do not press ESC, CTRL, ALT, or any other special keys during the test.</li>
          <li>Ensure you have a stable internet connection.</li>
          <li>Do not refresh or close the browser tab during the test.</li>
          <li>Answer all questions within the allotted time.</li>
          <li>Any attempt to bypass these rules may result in disqualification.</li>
        </ol>

        <div style={styles.buttons}>
          <button onClick={handleStart} style={styles.startButton}>✅ Start Test</button>
          <button onClick={handleCancel} style={styles.cancelButton}>❌ Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Styles remain unchanged...
const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    zIndex: 10000,
  },
  content: {
    width: '90%',
    maxWidth: '800px',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: '1.5rem',
    color: '#0f172a',
    textAlign: 'center',
  },
  rulesList: {
    flexGrow: 1,
    textAlign: 'left',
    marginBottom: '2rem',
    color: '#334155',
    fontSize: '1.1rem',
    lineHeight: '3.0',
    overflowY: 'auto',
    border: '1.5px solid black',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    listStyleType: 'decimal',
    paddingLeft: '1.5rem',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  startButton: {
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
};

export default Rules;
