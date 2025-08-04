import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaPhone, FaUniversity, FaGlobe } from 'react-icons/fa';
import Navbar from '../component/Navbar';

const ShowProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile/get-profile', {
          withCredentials: true,
        });
        setProfile(res.data.profile);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  console.log("Profile data:", profile);
  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
    <Navbar/>
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">👤 User Profile</h2>

        <div className="profile-info">
          <div className="profile-item">
            <FaUser className="icon" />
            <span><strong>Name:</strong> {profile.name}</span>
          </div>
          <div className="profile-item">
            <FaPhone className="icon" />
            <span><strong>Phone:</strong> {profile.phone}</span>
          </div>
          <div className="profile-item">
            <FaGlobe className="icon" />
            <span><strong>Country:</strong> {profile.country}</span>
          </div>
          <div className="profile-item">
            <FaUniversity className="icon" />
            <span><strong>University:</strong> {profile.university}</span>
          </div>
        </div>
      </div>

      {/* Inline styles injected into the component */}
      <style>{`
        .profile-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #c3ecff, #f0f8ff);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .profile-card {
          background: white;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          max-width: 450px;
          width: 90%;
          transition: transform 0.3s ease;
        }

        .profile-card:hover {
          transform: scale(1.02);
        }

        .profile-title {
          text-align: center;
          font-size: 26px;
          margin-bottom: 25px;
          color: #333;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .profile-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          color: #444;
        }

        .icon {
          color: #3a86ff;
          font-size: 18px;
        }

        .loading, .error {
          text-align: center;
          font-size: 18px;
          color: #ff595e;
          margin-top: 50px;
        }
      `}</style>
    </div>
  </>
  );
};

export default ShowProfile;
