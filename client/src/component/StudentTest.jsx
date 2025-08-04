import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StudentTest = () => {
  const { testId } = useParams();
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  console.log('this is Student', testId);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/test/${testId}`,{testId});
        setTestData(res.data);
        setRemainingTime(res.data.durationMinutes * 60);
      } catch (err) {
        console.error('Error fetching test data:', err);
      }
    };
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (remainingTime === null || submitted) return;

    if (remainingTime <= 0) {
      handleSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (submitted || !testData) return;

    try {
      await axios.post(`http://localhost:5000/api/submit`, {
        testId,
        answers,
      });
      setSubmitted(true);
      alert('Test submitted successfully!');
    } catch (err) {
      console.error('Error submitting test:', err);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  if (!testData) return <p>Loading test...</p>;

  const q = testData.questions[currentQuestionIndex];

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📝 {testData.name}</h2>
      <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        ⏰ Time Left: <strong>{formatTime(remainingTime)}</strong>
      </div>

      <div key={q._id} style={{ marginBottom: '1rem' }}>
        <p><strong>Q{currentQuestionIndex + 1}: {q.questionText}</strong></p>

        {q.questionType === 'one-choice' &&
          q.options.map(opt => (
            <label key={opt.text} style={{ display: 'block' }}>
              <input
                type="radio"
                name={q._id}
                value={opt.text}
                onChange={() => handleChange(q._id, opt.text)}
                checked={answers[q._id] === opt.text}
                disabled={submitted}
              /> {opt.text}
            </label>
          ))
        }

        {q.questionType === 'multiple-choice' &&
          q.options.map(opt => (
            <label key={opt.text} style={{ display: 'block' }}>
              <input
                type="checkbox"
                name={q._id}
                value={opt.text}
                onChange={(e) => {
                  const existing = answers[q._id] || [];
                  if (e.target.checked) {
                    handleChange(q._id, [...existing, opt.text]);
                  } else {
                    handleChange(q._id, existing.filter(item => item !== opt.text));
                  }
                }}
                checked={answers[q._id]?.includes(opt.text)}
                disabled={submitted}
              /> {opt.text}
            </label>
          ))
        }

        {q.questionType === 'descriptive' &&
          <textarea
            rows={3}
            onChange={e => handleChange(q._id, e.target.value)}
            value={answers[q._id] || ''}
            disabled={submitted}
          />
        }
      </div>

      {!submitted && (
        <button
          onClick={handleNext}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: currentQuestionIndex < testData.questions.length - 1 ? 'blue' : 'green',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {currentQuestionIndex < testData.questions.length - 1 ? 'Next' : 'Submit'}
        </button>
      )}

      {submitted && <p style={{ color: 'green' }}>✅ Test Submitted!</p>}
    </div>
  );
};

export default StudentTest;
