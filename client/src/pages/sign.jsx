import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ email, password, confirmPassword}),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Something went wrong');
      } else {
        setSuccessMsg(data.message || 'Signup successful!');

        // Optionally, reset form
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setErrorMsg('Server error. Please try again later.');
    }
  };

  return (
    <>
      <div className="form-container">
        <h2>Signup</h2>
        {errorMsg && <div className="error-popup">{errorMsg}</div>}
        {successMsg && <div className="success-popup">{successMsg}</div>}

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          /><br />
          <button type="submit">Sign Up</button>
          <div className="back" onClick={()=>navigate('/login')}>Back</div>
        </form>
      </div>

      {/* CSS at the bottom */}
      <style>{`
        .back{
          margin-top: 10px;
          color: #007bff;
          cursor: pointer;
        }
        .form-container {
          width: 100%;
          max-width: 400px;
          margin: 50px auto;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background-color: #fff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .form-container h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .form-container input {
          width: 93%;
          padding: 10px 12px;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-container input:focus {
          border-color: #007bff;
          outline: none;
        }

        .form-container button {
          width: 100%;
          padding: 10px 12px;
          background-color: #007bff;
          color: #fff;
          font-size: 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .form-container button:hover {
          background-color: #0056b3;
        }

        .error-popup {
          background-color: #ffe0e0;
          color: #d8000c;
          border: 1px solid #d8000c;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border-radius: 6px;
          text-align: center;
          font-weight: bold;
        }

        .success-popup {
          background-color: #e0ffe0;
          color: #006400;
          border: 1px solid #006400;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border-radius: 6px;
          text-align: center;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}

export default Signup;
