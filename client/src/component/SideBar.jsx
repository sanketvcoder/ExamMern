import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const [emailInput, setEmailInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [verifyEmail, setVerifyEmail] = useState(true);
  const [profileCreated, setProfileCreated] = useState(true);

  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    country: '',
    university: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/get-user-email', {
          withCredentials: true,
        });
        setUserEmail(res.data.email);
        setVerifyEmail(res.data.verifyEmail);
        setProfileCreated(res.data.profileCreated);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleSendOtp = async () => {
    if (emailInput !== userEmail) {
      alert('Entered email does not match your login email.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/auth/send-verify-otp',
        { email: emailInput },
        { withCredentials: true }
      );
      setOtpSent(true);
    } catch (err) {
      alert('Error sending OTP.');
    }
  };

  const handleVerifyOtp = async () => {
 
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/verify-email-otp',
        { otp: otpInput },
        { withCredentials: true }
      );
      if (res.data.success) {
        alert('Email verified successfully.');
        setVerifyEmail(true);
        setShowVerifyPopup(false);
      } else {
        alert('Invalid OTP.');
      }
    } catch (err) {
      alert('Verification failed.');
    }
  };

  const handleProfileSubmit = async () => {
    console.log("Profile data being submitted:", profileData); 
    try {
      const res = await axios.post(
        'http://localhost:5000/api/profile/create-profile',
        profileData,
        { withCredentials: true }
      );
      if (res.data.success) {
        alert('Profile created successfully.');
        setProfileCreated(true);
        setShowProfilePopup(false);
      }
    } catch (err) {
      alert('Profile creation failed.');
    }
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Dashboard</h2>

      {/* Create Profile or Profile Link */}
      {!profileCreated ? (
        <button
          style={styles.verifyBtn}
          onClick={() => setShowProfilePopup(true)}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles.verifyBtnHover.backgroundColor)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.verifyBtn.backgroundColor)}
        >
          Create Profile
        </button>
      ) : (
        <button
          style={styles.verifyBtn}
          onClick={() => navigate('/profile')}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles.verifyBtnHover.backgroundColor)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.verifyBtn.backgroundColor)}
        >
          Profile
        </button>
      )}

      {/* Verify Email Button */}
      {!verifyEmail && (
        <button
          style={styles.verifyBtn}
          onClick={() => setShowVerifyPopup(true)}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles.verifyBtnHover.backgroundColor)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.verifyBtn.backgroundColor)}
        >
          Verify Email
        </button>
      )}

      {/* Email Verify Popup */}
      {showVerifyPopup && (
        <div style={styles.popup}>
          <div style={styles.popupInner}>
            <h3 style={styles.popupTitle}>Email Verification</h3>
            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={styles.input}
                />
                <button style={styles.button} onClick={handleSendOtp}>
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  style={styles.input}
                />
                <button style={styles.button} onClick={handleVerifyOtp}>
                  Verify OTP
                </button>
              </>
            )}
            <button style={styles.cancelButton} onClick={() => setShowVerifyPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Profile Creation Popup */}
      {showProfilePopup && (
        <div style={styles.popup}>
          <div style={styles.popupInner}>
            <h3 style={styles.popupTitle}>Create Profile</h3>
            <input
              type="text"
              placeholder="Name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Phone"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Country"
              value={profileData.country}
              onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="University"
              value={profileData.university}
              onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
              style={styles.input}
            />
            <button style={styles.button} onClick={handleProfileSubmit}>
              Submit
            </button>
            <button style={styles.cancelButton} onClick={() => setShowProfilePopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  sidebar: {
    width: '220px',
    backgroundColor: '#f0f4f8',
    height: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    borderRight: '1px solid #ccc',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    color: '#2c3e50',
  },
  verifyBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '100%',
    transition: 'background-color 0.3s ease',
    marginBottom: '10px',
  },
  verifyBtnHover: {
    backgroundColor: '#c0392b',
  },
  popup: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popupInner: {
    background: 'white',
    width: '320px',
    padding: '30px 25px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    textAlign: 'center',
  },
  popupTitle: {
    marginBottom: '1.5rem',
    color: '#34495e',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    backgroundColor: '#2980b9',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    fontSize: '1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '10px',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    backgroundColor: '#7f8c8d',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    fontSize: '1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
  },
};

export default SideBar;
