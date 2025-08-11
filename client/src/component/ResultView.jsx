import React, { useState } from 'react';

const mockResult = {
  candidateName: 'Rohan Verma',
  testName: 'Science 101',
  score: '4/6',
  questions: [
    {
      question: 'Which part of the plant makes food?',
      options: ['Root', 'Stem', 'Leaf', 'Flower'],
      selected: 'Leaf',
      marks: '2/2',
    },
    {
      question: 'What is Photosynthesis?',
      answer:
        'Photosynthesis is the process by which green plants make their own food using sunlight, carbon dioxide, and water. This process happens in the chlorophyll (green pigment) present in leaves.',
      marks: '2/4',
    },
  ],
};

const ResultView = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailRow, setShowDetailRow] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🏁 Results</h2>

      {/* Test Card */}
      <div className="test-card">
        <span>🧪 {mockResult.testName}</span>
        <button className="view-btn" onClick={() => setShowDetailRow(!showDetailRow)}>
          View
        </button>
      </div>

      {/* Detail Row */}
      {showDetailRow && (
        <div className="detail-card" onClick={() => setShowModal(true)}>
          <span>{mockResult.testName}</span>
          <span>{mockResult.candidateName}</span>
          <span>{mockResult.score}</span>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Candidate: {mockResult.candidateName}</h3>
            <p>Exam: {mockResult.testName}</p>
            <p>Score: {mockResult.score}</p>
            <hr />
            {mockResult.questions.map((q, index) => (
              <div key={index}>
                <p><strong>Q{index + 1}:</strong> {q.question}</p>
                {q.options && (
                  <ul>
                    {q.options.map((opt, i) => (
                      <li key={i}>{String.fromCharCode(65 + i)}) {opt}</li>
                    ))}
                  </ul>
                )}
                {q.answer && <p>{q.answer}</p>}
                <p>Marks Allocated: {q.marks}</p>
                <hr />
              </div>
            ))}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .test-card {
          border: 1px solid #ccc;
          padding: 1rem;
          margin-bottom: 0.5rem;
          border-radius: 8px;
          background-color: #f9f9f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .view-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 5px;
          cursor: pointer;
        }

        .view-btn:hover {
          background-color: #0056b3;
        }

        .detail-card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          background-color: #e9ecef;
          cursor: pointer;
        }

        .modal {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          max-width: 600px;
          width: 90%;
        }

        .modal-content ul {
          list-style: none;
          padding-left: 0;
        }

        .modal-content li {
          margin-bottom: 5px;
        }

        .modal-content button {
          margin-top: 10px;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .modal-content button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ResultView;
