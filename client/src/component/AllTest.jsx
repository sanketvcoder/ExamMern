import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllTests = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await axios.get('http://localhost:5000/api/test/all', { withCredentials: true });
        setTests(res.data.tests);
      } catch (err) {
        console.error('Error fetching tests:', err);
      }
    }
    fetchTests();
  }, []);

  return (
    <>
      <div className="test-grid">
        {tests.map((test) => (
          <div
            key={test._id}
            className="test-card"
            onClick={() => navigate(`/test-info/${test._id}`)}
            

          >
            <div className="test-icon">📝</div>
            <div className="test-name">{test.name}</div>
          </div>
        ))}
      </div>

      <style>{`
        .test-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          padding: 2rem;
        }
        .test-card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 20px;
          cursor: pointer;
          text-align: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          transition: box-shadow 0.3s ease;
        }
        .test-card:hover {
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
        }
        .test-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }
        .test-name {
          font-weight: 600;
          font-size: 18px;
          color: #333;
        }
      `}</style>
    </>
  );
};

export default AllTests;
