import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Assessment = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tests/all');
        setTests(res.data);
      } catch (err) {
        console.error('Failed to fetch tests:', err);
      }
    };
    fetchTests();
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '20px' }}>
      {tests.map(test => (
        <div 
          key={test._id} 
          onClick={() => navigate(`/dashboard/test/security/${test._id}`)} 
          style={{ 
            border: '1px solid #ddd', 
            borderRadius: '10px', 
            padding: '10px', 
            cursor: 'pointer', 
            textAlign: 'center',
            boxShadow: '0 0 5px rgba(0,0,0,0.1)'
          }}
          title={test.name}
        >
          {/* Replace with icon if you want */}
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div>
          <div style={{ fontWeight: 'bold' }}>{test.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Assessment;
