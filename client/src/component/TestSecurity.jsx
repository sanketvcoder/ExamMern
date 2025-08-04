import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const TestSecurity = () => {
  const { testId } = useParams();
  const [accessId, setAccessId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [readyPopup, setReadyPopup] = useState(false);
    console.log("TestId in testSecurity",testId)
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/test/verify-access/${testId}`, {
        testId,
        accessId,
        password,
      });
      if (res.data.success) {
        setReadyPopup(true);
      } else {
        setError('Invalid ID or password.');
      }
    } catch (err) {
      setError('Verification failed.');
    }
  };

  const startTest = () => {
    setReadyPopup(false);
    navigate(`/dashboard/test/start/${testId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Enter Test ID and Password</h2>
      <input 
        type="text" 
        placeholder="Test ID" 
        value={accessId} 
        onChange={e => setAccessId(e.target.value)} 
        style={{ marginRight: '10px' }}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
      <button onClick={handleVerify}>Verify</button>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {readyPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{background: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center'}}>
            <p>Are you ready to start the test?</p>
            <button onClick={startTest} style={{ marginRight: '10px' }}>Start Test</button>
            <button onClick={() => setReadyPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSecurity;

