import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [step, setStep] = useState('email');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Something went wrong');
      } else {
        setSuccessMsg(data.message);
        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate('/admin-dashboard');
          }else if(data.user.role === 'teacher'){
            navigate('/teacher-dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 1500);

      }
    } catch (err) {
      setErrorMsg('Server error. Please try again later.');
    }
  };

  return (
    <>
      <div className="form-container">
        <h2>Login</h2>
        {errorMsg && <div className="error-popup">{errorMsg}</div>}
        {successMsg && <div className="success-popup">{successMsg}</div>}

        <form onSubmit={handleLogin}>
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
          <div className="forgot-password" onClick={() => setForgotOpen(true)}>
            Forgot Password?
          </div>
          <button type="submit">Login</button>
          <div className="forgot-password"onClick={()=>navigate('/signup')}>Sign Up</div>
        </form>

        {/* Forgot Password Modal */}
        {forgotOpen && (
          <div className="forgot-modal">
            <div className="forgot-content">
              {step === 'email' && (
                <>
                  <h3>Reset Password</h3>
                  {forgotError && <div className="error-popup">{forgotError}</div>}
                  {forgotMsg && <div className="success-popup">{forgotMsg}</div>}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setForgotError('');
                      setForgotMsg('');

                      try {
                        const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: forgotEmail }),
                        });

                        const data = await res.json();
                        if (!res.ok) return setForgotError(data.message);
                        setForgotMsg('OTP sent to email');
                        setStep('otp');
                      } catch {
                        setForgotError('Server error');
                      }
                    }}
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    /><br />
                    <button type="submit">Send OTP</button>
                  </form>
                </>
              )}

              {step === 'otp' && (
                <>
                  <h3>Verify OTP</h3>
                  {forgotError && <div className="error-popup">{forgotError}</div>}
                  {forgotMsg && <div className="success-popup">{forgotMsg}</div>}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setForgotError('');
                      setForgotMsg('');

                      try {
                        const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: forgotEmail, otp }),
                        });

                        const data = await res.json();
                        if (!res.ok) return setForgotError(data.message);
                        setForgotMsg('OTP verified');
                        setStep('reset');
                      } catch {
                        setForgotError('Error verifying OTP');
                      }
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    /><br />
                    <button type="submit">Verify OTP</button>
                  </form>
                </>
              )}

              {step === 'reset' && (
                <>
                  <h3>Set New Password</h3>
                  {forgotError && <div className="error-popup">{forgotError}</div>}
                  {forgotMsg && <div className="success-popup">{forgotMsg}</div>}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setForgotError('');
                      setForgotMsg('');

                      try {
                        const res = await fetch('http://localhost:5000/api/auth/reset-password', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: forgotEmail, newPassword }),
                        });

                        const data = await res.json();
                        if (!res.ok) return setForgotError(data.message);
                        setForgotMsg('Password reset successful');
                        setTimeout(() => {
                          setForgotOpen(false);
                          setStep('email');
                          setForgotEmail('');
                          setOtp('');
                          setNewPassword('');
                        }, 1500);
                      } catch {
                        setForgotError('Server error');
                      }
                    }}
                  >
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    /><br />
                    <button type="submit">Save Password</button>
                  </form>
                </>
              )}

              <button
                type="button"
                className="close-btn"
                onClick={() => {
                  setForgotOpen(false);
                  setStep('email');
                  setForgotEmail('');
                  setOtp('');
                  setNewPassword('');
                  setForgotError('');
                  setForgotMsg('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .form-container {
          margin-top: 50px;
          max-width: 400px;
          margin: 50px auto;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background-color: #fff;
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
        .form-container button {
          width: 100%;
          padding: 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          margin-bottom: 1rem;
        }
        .error-popup, .success-popup {
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 1rem;
          text-align: center;
        }
        .error-popup {
          background: #ffe0e0;
          color: #d8000c;
          border: 1px solid #d8000c;
        }
        .success-popup {
          background: #e0ffe0;
          color: #006400;
          border: 1px solid #006400;
        }
        .forgot-password {
          text-align: right;
          cursor: pointer;
          color: #007bff;
          margin-bottom: 1rem;
        }
        .forgot-modal {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .forgot-content {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        .close-btn {
          background: #aaa;
          color: white;
          padding: 8px;
          border: none;
          border-radius: 6px;
          width: 100%;
        }
      `}</style>
    </>
  );
}

export default Login;
