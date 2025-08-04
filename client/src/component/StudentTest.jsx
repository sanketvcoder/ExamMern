import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudentTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch test data
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.post(`http://localhost:5000/api/test/${testId}`, { testId });
        setTestData(res.data);
        setRemainingTime(res.data.durationMinutes * 60);

        // Auto-trigger fullscreen on start
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error('Error fetching test data:', err);
      }
    };
    fetchTest();
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (remainingTime === null || submitted) return;

    if (remainingTime <= 0) {
      triggerSubmitAndPopup();
      return;
    }

    const timerId = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime, submitted]);

  // Keydown listener for Escape, Ctrl, Alt to trigger submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (submitted) return;

      console.log('Key pressed:', e.key, e.code); // Debug log

      if (e.code === 'Escape' || e.ctrlKey || e.altKey) {
        e.preventDefault && e.preventDefault();
        triggerSubmitAndPopup();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [submitted]);

  // Removed fullscreen toggle and button completely

  const triggerSubmitAndPopup = () => {
    if (submitted) return;

    setSubmitted(true);
    setShowThankYouPopup(true);

    setTimeout(() => {
      setShowThankYouPopup(false);
      navigate('/dashboard');
    }, 5000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      triggerSubmitAndPopup();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (!testData) return <div style={styles.loading}>Loading test...</div>;

  const q = testData.questions[currentQuestionIndex];

  return (
    <>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>📝 {testData.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={styles.timer}>
                ⏰ Time Left: <strong>{formatTime(remainingTime)}</strong>
              </div>
              {/* No fullscreen button */}
            </div>
          </div>

          <hr />

          <div key={q._id} style={styles.questionBlock}>
            <p style={styles.questionText}>
              <strong>Q{currentQuestionIndex + 1}:</strong> {q.questionText}
            </p>

            {q.questionType === 'one-choice' &&
              q.options.map((opt) => (
                <label key={opt.text} style={styles.option}>
                  <input
                    type="radio"
                    name={q._id}
                    value={opt.text}
                    onChange={() => handleChange(q._id, opt.text)}
                    checked={answers[q._id] === opt.text}
                    disabled={submitted}
                  />
                  {opt.text}
                </label>
              ))}

            {q.questionType === 'multiple-choice' &&
              q.options.map((opt) => (
                <label key={opt.text} style={styles.option}>
                  <input
                    type="checkbox"
                    name={q._id}
                    value={opt.text}
                    onChange={(e) => {
                      const existing = answers[q._id] || [];
                      if (e.target.checked) {
                        handleChange(q._id, [...existing, opt.text]);
                      } else {
                        handleChange(q._id, existing.filter((item) => item !== opt.text));
                      }
                    }}
                    checked={answers[q._id]?.includes(opt.text)}
                    disabled={submitted}
                  />
                  {opt.text}
                </label>
              ))}

            {q.questionType === 'descriptive' && (
              <textarea
                rows={4}
                onChange={(e) => handleChange(q._id, e.target.value)}
                value={answers[q._id] || ''}
                disabled={submitted}
                style={styles.textarea}
              />
            )}
          </div>

          <div style={styles.buttonContainer}>
            {!submitted && (
              <>
                <button
                  onClick={handleBack}
                  style={{
                    ...styles.button,
                    backgroundColor: '#007bff',
                    marginRight: '1rem',
                    cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                  }}
                  disabled={currentQuestionIndex === 0}
                >
                  ⬅️ Back
                </button>

                <button
                  onClick={handleNext}
                  style={{
                    ...styles.button,
                    backgroundColor:
                      currentQuestionIndex < testData.questions.length - 1
                        ? '#007bff'
                        : '#28a745',
                  }}
                >
                  {currentQuestionIndex < testData.questions.length - 1
                    ? 'Next ➡️'
                    : 'Submit ✅'}
                </button>
              </>
            )}
          </div>

          {submitted && !showThankYouPopup && (
            <p style={styles.submitted}>✅ Test Submitted Successfully!</p>
          )}
        </div>
      </div>

      {showThankYouPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2>Thank You for Submission!</h2>
            <p>Your test has been submitted successfully.</p>
            <p>You will be redirected shortly...</p>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f2f2f2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    margin: 0,
  },
  timer: {
    fontSize: '1.8rem',
    color: '#ff5722',
  },
  questionBlock: {
    flexGrow: 1,
    marginBottom: '1rem',
  },
  questionText: {
    fontSize: '1.6rem',
    marginBottom: '0.8rem',
    color: '#444',
  },
  option: {
    display: 'block',
    marginBottom: '0.6rem',
    fontSize: '1.5rem',
    color: '#555',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '0.8rem',
    fontSize: '1.3rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    resize: 'none',
    marginTop: '0.5rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: '1rem',
    padding: '1rem 2rem',
    color: '#fff',
    fontSize: '1.3rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  submitted: {
    marginTop: '1rem',
    fontSize: '1.3rem',
    color: '#28a745',
    textAlign: 'center',
  },
  loading: {
    fontSize: '1.5rem',
    color: '#777',
    textAlign: 'center',
    marginTop: '5rem',
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  popup: {
    width: '40%',
    height: '35%',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#333',
  },
};

export default StudentTest;
