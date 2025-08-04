import Test from '../../models/examModel.js';


export const getAllPublishedTests = async (req, res) => {
  try {
    const tests = await Test.find({
      isPublished: true,
    }).select('name scheduledTime durationMinutes');

    res.status(200).json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllTestsForStudent = async (req, res) => {
  try {
    const tests = await Test.find({});
    res.status(200).json(tests);
  } catch (error) {
    console.error('Error fetching tests for student:', error);
    res.status(500).json({ message: 'Server error while fetching tests' });
  }
};




// Get a specific test (without correct answers)
// controllers/testController.js

export const getTestssById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the test by id from the Test collection
    const test = await Test.findById(id).lean();
    console.log("TestId",test)

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Remove the 'correctAnswer' field from each question, index by index
    const sanitizedQuestions = [];
    for (let i = 0; i < test.questions.length; i++) {
      const { correctAnswer, ...rest } = test.questions[i];
      sanitizedQuestions.push(rest);
    }

    // Replace the questions array with the sanitized one
    test.questions = sanitizedQuestions;

    // Return the sanitized test document
    res.status(200).json(test);

  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ message: "Server error" });
  }
};







export const verifyTestAccess = async (req, res) => {
  try {
    const testIdFromParams = req.params.testId;
    const { accessId, password } = req.body;

    console.log('Verifying access for test ID:', testIdFromParams, 'with accessId:', accessId);

    if (!accessId || !password) {
      return res.status(400).json({ success: false, message: 'Access ID and password are required' });
    }

    const test = await Test.findById(testIdFromParams);

    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // ✅ Compare accessId with test._id
    if (accessId !== test._id.toString()) {
      return res.status(401).json({ success: false, message: 'Access ID does not match test ID' });
    }

    if (test.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    if (!test.isPublished) {
      return res.status(403).json({ success: false, message: 'Test is not published yet' });
    }

    return res.status(200).json({ success: true, message: 'Access verified' });
  } catch (error) {
    console.error('Error verifying test access:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};





// Submit answers for a test
export const submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    let totalScore = 0;

    test.questions.forEach((q, index) => {
      const studentAnswer = answers[q._id];

      if (q.questionType === 'one-choice' || q.questionType === 'multiple-choice') {
        const correctOptionIds = q.options.filter(opt => opt.isCorrect).map(opt => opt._id.toString());
        const selectedOptionIds = (studentAnswer || []).map(id => id.toString());

        const isCorrect = q.questionType === 'one-choice'
          ? correctOptionIds.length === 1 && correctOptionIds[0] === selectedOptionIds[0]
          : correctOptionIds.every(id => selectedOptionIds.includes(id)) &&
            selectedOptionIds.every(id => correctOptionIds.includes(id));

        if (isCorrect) {
          totalScore += q.marks;
        }
      } else if (q.questionType === 'descriptive') {
        // Optional: Handle subjective checking manually later
      }
    });

    res.status(200).json({ success: true, message: 'Test submitted successfully', score: totalScore });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
