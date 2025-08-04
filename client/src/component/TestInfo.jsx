import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const TestInfo = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [testName, setTestName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTest() {
      try {
        const res = await axios.get(`http://localhost:5000/api/test/${testId}`, { withCredentials: true });
        setTest(res.data.test);
        setTestName(res.data.test.name);
        setQuestions(res.data.test.questions);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load test:', err);
      }
    }
    fetchTest();
  }, [testId]);

  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex][field] = value;

    if (questions[qIndex].questionType === 'one-choice' && field === 'isCorrect' && value === true) {
      updated[qIndex].options = updated[qIndex].options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === oIndex,
      }));
    }
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionType: 'one-choice',
        marks: 1,
        options: [{ text: '', isCorrect: false }],
        correctAnswer: '',
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updated = [...questions];
      updated.splice(index, 1);
      setQuestions(updated);
    }
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options.push({ text: '', isCorrect: false });
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const updateMarks = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].marks = value;
    setQuestions(updated);
  };

  const handleSave = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/test/${testId}`, {
        name: testName,
        questions,
      }, { withCredentials: true });

      alert('Test updated successfully!');
    } catch (err) {
      alert('Failed to update test: ' + (err.response?.data?.message || err.message));
    }
  };

  // New: Delete Test handler
  const handleDeleteTest = async () => {
    if (!window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) return;

    try {
      await axios.delete(`http://localhost:5000/api/test/${testId}`, { withCredentials: true });
      alert('Test deleted successfully!');
      navigate('/'); // Redirect after deletion, adjust as needed
    } catch (err) {
      alert('Failed to delete test: ' + (err.response?.data?.message || err.message));
    }
  };

  // New: Publish Test handler
  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish this test? This will notify all users.')) return;

    try {
      const res = await axios.patch(`http://localhost:5000/api/test/${testId}/publish`, {}, { withCredentials: true });
      alert(res.data.message);
      setTest((prev) => ({ ...prev, isPublished: true }));
    } catch (err) {
      alert('Failed to publish test: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
    <Navbar/>
      <div className="container">
        <h2>
          <input
            className="test-name-input"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
        </h2>

        <button className="add-question-btn" onClick={addQuestion}>➕ Add Question</button>

        {questions.map((q, i) => (
          <div key={i} className="question-card">
            <div className="question-header">
              <strong>Q{i + 1}:</strong>
              <button className="delete-btn" onClick={() => removeQuestion(i)}>🗑️</button>
            </div>

            <input
              className="question-text-input"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(i, 'questionText', e.target.value)}
              placeholder="Question Text"
            />

            <div className="marks-row">
              Marks:
              <input
                type="number"
                min={1}
                className="marks-input"
                value={q.marks}
                onChange={(e) => updateMarks(i, Number(e.target.value))}
              />
            </div>

            <select
              className="question-type-select"
              value={q.questionType}
              onChange={(e) => handleQuestionChange(i, 'questionType', e.target.value)}
            >
              <option value="one-choice">One Correct</option>
              <option value="multiple-choice">Multiple Correct</option>
              <option value="descriptive">Descriptive</option>
            </select>

            {(q.questionType === 'one-choice' || q.questionType === 'multiple-choice') && (
              <div className="options-list">
                {q.options?.map((opt, oi) => (
                  <div key={oi} className="option-row">
                    <input
                      className="option-text-input"
                      value={opt.text}
                      onChange={(e) => handleOptionChange(i, oi, 'text', e.target.value)}
                      placeholder={`Option ${oi + 1}`}
                    />

                    <label>
                      <input
                        type={q.questionType === 'multiple-choice' ? 'checkbox' : 'radio'}
                        name={`correct-option-${i}`}
                        checked={opt.isCorrect}
                        onChange={(e) => handleOptionChange(i, oi, 'isCorrect', e.target.checked)}
                      />
                      Correct
                    </label>

                    {q.options.length > 1 && (
                      <button
                        className="remove-option-btn"
                        onClick={() => removeOption(i, oi)}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
                <button className="add-option-btn" onClick={() => addOption(i)}>➕ Add Option</button>
              </div>
            )}

            {q.questionType === 'descriptive' && (
              <textarea
                className="descriptive-answer-input"
                value={q.correctAnswer}
                placeholder="Correct Answer (optional)"
                onChange={(e) => handleQuestionChange(i, 'correctAnswer', e.target.value)}
                rows={3}
              />
            )}
          </div>
        ))}

        <button className="save-btn" onClick={handleSave}>💾 Save All Updates</button>
        <button className="publish-btn" onClick={handlePublish} disabled={test?.isPublished} title={test?.isPublished ? "Test already published" : "Publish this test"}>
          {test?.isPublished ? '✅ Published' : '🚀 Publish Test'}
        </button>
        <button className="delete-test-btn" onClick={handleDeleteTest}>🗑️ Delete Test</button>
      </div>

      <style>{`
        .container {
          max-width: 900px;
          margin: 2rem auto;
          padding: 1rem;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }
        .test-name-input {
          width: 100%;
          font-size: 28px;
          font-weight: 700;
          padding: 8px 12px;
          border: 2px solid #ddd;
          border-radius: 6px;
          margin-bottom: 1rem;
        }
        .add-question-btn, .save-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          margin-bottom: 1rem;
          transition: background-color 0.2s ease;
        }
        .add-question-btn:hover, .save-btn:hover {
          background-color: #0056b3;
        }
        .publish-btn {
          width: 100%;
          background-color: #28a745;
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 0.5rem;
          transition: background-color 0.2s ease;
        }
        .publish-btn:hover:not(:disabled) {
          background-color: #1e7e34;
        }
        .publish-btn:disabled {
          cursor: not-allowed;
          background-color: #94d3a2;
        }
        .delete-test-btn {
          width: 100%;
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 0.5rem;
          transition: background-color 0.2s ease;
        }
        .delete-test-btn:hover {
          background-color: #a71d2a;
        }
        .question-card {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
        }
        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 18px;
        }
        .delete-btn {
          background: none;
          border: none;
          color: red;
          font-size: 22px;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .delete-btn:hover {
          color: darkred;
        }
        .question-text-input {
          width: 100%;
          padding: 8px 12px;
          font-size: 16px;
          border-radius: 5px;
          border: 1px solid #aaa;
          margin-bottom: 10px;
        }
        .marks-row {
          margin-bottom: 10px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .marks-input {
          width: 60px;
          padding: 4px 8px;
          font-size: 14px;
          border-radius: 5px;
          border: 1px solid #aaa;
        }
        .question-type-select {
          padding: 8px 12px;
          margin-bottom: 12px;
          font-size: 14px;
          border-radius: 5px;
          border: 1px solid #aaa;
        }
        .options-list {
          margin-bottom: 12px;
        }
        .option-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .option-text-input {
          flex: 1;
          padding: 6px 10px;
          font-size: 14px;
          border-radius: 5px;
          border: 1px solid #aaa;
        }
        .remove-option-btn {
          background: none;
          border: none;
          color: red;
          font-size: 18px;
          cursor: pointer;
        }
        .add-option-btn {
          background-color: #17a2b8;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
        }
        .add-option-btn:hover {
          background-color: #117a8b;
        }
        .descriptive-answer-input {
          width: 100%;
          border-radius: 6px;
          border: 1px solid #aaa;
          padding: 8px 12px;
          font-size: 14px;
          resize: vertical;
        }
        .save-btn {
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default TestInfo;
