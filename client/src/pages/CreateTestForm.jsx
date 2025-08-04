import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';

const CreateTestForm = () => {
  const [testName, setTestName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [password, setPassword] = useState('');
  const [targetSection, setTargetSection] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      questionType: 'one-choice',
      marks: 1,
      options: [{ text: '', isCorrect: false }],
      correctAnswer: '',
    },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;

    if (field === 'questionType') {
      if (value === 'descriptive') {
        updated[index].options = [];
        updated[index].correctAnswer = '';
      } else {
        updated[index].options = [{ text: '', isCorrect: false }];
        updated[index].correctAnswer = '';
      }
    }

    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex][field] = value;
    if (questions[qIndex].questionType === 'one-choice' && field === 'isCorrect' && value === true) {
      // Make only one correct option selected
      updated[qIndex].options = updated[qIndex].options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === oIndex,
      }));
    }
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: '', isCorrect: false });
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
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
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const scheduledDateISO = scheduledTime ? new Date(scheduledTime).toISOString() : null;

    const payload = {
      name: testName.trim(),
      password,
      scheduledTime: scheduledDateISO,
      durationMinutes,
      targetSection: targetSection.trim(),
      questions: questions.map((q) => ({
        questionText: q.questionText.trim(),
        questionType: q.questionType,
        marks: q.marks,
        options:
          q.questionType !== 'descriptive'
            ? q.options.map((opt) => ({
                text: opt.text.trim(),
                isCorrect: opt.isCorrect,
              }))
            : [],
        correctAnswer: q.questionType === 'descriptive' ? q.correctAnswer.trim() : '',
      })),
    };

    try {
      const res = await axios.post('http://localhost:5000/api/test/create', payload, {
        withCredentials: true,
      });
      alert('✅ Test created successfully!');
      setTestName('');
      setScheduledTime('');
      setDurationMinutes(60);
      setPassword('');
      setTargetSection('');
      setQuestions([
        {
          questionText: '',
          questionType: 'one-choice',
          marks: 1,
          options: [{ text: '', isCorrect: false }],
          correctAnswer: '',
        },
      ]);
    } catch (err) {
      console.error('Backend error:', err.response?.data);
      alert('❌ Failed to create test: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form">
          <h2 className="form-title">Create a New Test</h2>

          <input
            type="text"
            placeholder="Test Name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="input"
            required
          />

          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="input"
            required
          />

          <input
            type="text"
            placeholder="Target Section (optional)"
            value={targetSection}
            onChange={(e) => setTargetSection(e.target.value)}
            className="input"
          />

          <input
            type="password"
            placeholder="Password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />

          <select
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="input"
          >
            <option value={60}>60 Minutes</option>
            <option value={90}>90 Minutes</option>
            <option value={120}>120 Minutes</option>
          </select>

          {questions.map((q, index) => (
            <div key={index} className="question-card">
              <div className="question-header-row">
                <h3 className="question-header">Question {index + 1}</h3>
                <button type="button" className="remove-btn" onClick={() => removeQuestion(index)}>
                  ❌
                </button>
              </div>

              <input
                type="text"
                placeholder="Question Text"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                className="input"
                required
              />

              <input
                type="number"
                placeholder="Marks"
                min={1}
                value={q.marks}
                onChange={(e) => handleQuestionChange(index, 'marks', Number(e.target.value))}
                className="input"
                required
              />

              <select
                value={q.questionType}
                onChange={(e) => handleQuestionChange(index, 'questionType', e.target.value)}
                className="input"
              >
                <option value="one-choice">One Correct</option>
                <option value="multiple-choice">Multiple Correct</option>
                <option value="descriptive">Descriptive</option>
              </select>

              {q.questionType !== 'descriptive' &&
                q.options.map((opt, i) => (
                  <div key={i} className="option-row">
                    <input
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt.text}
                      onChange={(e) => handleOptionChange(index, i, 'text', e.target.value)}
                      className="input option-input"
                      required
                    />
                    <label>
                      <input
                        type={q.questionType === 'multiple-choice' ? 'checkbox' : 'radio'}
                        name={`correct-${index}`}
                        checked={opt.isCorrect}
                        onChange={(e) => handleOptionChange(index, i, 'isCorrect', e.target.checked)}
                      />
                      Correct
                    </label>
                    {q.options.length > 1 && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeOption(index, i)}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}

              {(q.questionType === 'one-choice' || q.questionType === 'multiple-choice') && (
                <button type="button" className="add-btn small" onClick={() => addOption(index)}>
                  ➕ Add Option
                </button>
              )}

              {q.questionType === 'descriptive' && (
                <textarea
                  rows={3}
                  placeholder="Correct Answer (optional)"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                  className="input"
                />
              )}
            </div>
          ))}

          <button type="button" onClick={addQuestion} className="add-btn">
            ➕ Add Question
          </button>

          <button type="submit" className="submit-btn">
            ✅ Create Test
          </button>
        </form>
      </div>

      <style>{`
        .form-wrapper {
          padding: 2rem;
          background-color: #f8f9fa;
          min-height: 100vh;
          display: flex;
          justify-content: center;
        }
        .form {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 0 12px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 700px;
        }
        .form-title {
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .input {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-sizing: border-box;
        }
        .question-card {
          background: #f1f1f1;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .question-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .question-header {
          font-size: 18px;
          margin: 0 0 10px 0;
        }
        .option-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .option-input {
          flex: 1;
        }
        .add-btn, .remove-btn, .submit-btn {
          padding: 10px 16px;
          font-size: 14px;
          border-radius: 5px;
          cursor: pointer;
          border: none;
        }
        .add-btn {
          background-color: #007bff;
          color: white;
        }
        .add-btn.small {
          font-size: 13px;
          padding: 6px 10px;
          margin-top: 8px;
        }
        .remove-btn {
          background: none;
          color: red;
          font-size: 18px;
        }
        .submit-btn {
          background-color: #28a745;
          color: white;
          width: 100%;
          margin-top: 20px;
          font-size: 16px;
        }
      `}</style>
    </>
  );
};

export default CreateTestForm;
