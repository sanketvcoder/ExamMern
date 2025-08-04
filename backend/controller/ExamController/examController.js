import Test from '../../models/examModel.js';
import mongoose from 'mongoose';

export const createTest = async (req, res) => {
  try {
    const {
      name,
      questions,
      password,
      scheduledTime,
      durationMinutes,
      targetSection
    } = req.body;

    // Get teacher ID from auth middleware (req.user)
    const teacher = req.user?.id;

    if (!teacher || !mongoose.Types.ObjectId.isValid(teacher)) {
      return res.status(400).json({ message: 'Invalid or missing teacher ID.' });
    }

    // Basic validation
    if (!name || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Name and at least one question are required.' });
    }

    // Validate each question
    for (const q of questions) {
      const { questionText, questionType, marks } = q;

      if (!questionText || !questionType || typeof marks !== 'number') {
        return res.status(400).json({ message: 'Each question must have text, type, and marks.' });
      }

      if (!['one-choice', 'multiple-choice', 'descriptive'].includes(questionType)) {
        return res.status(400).json({ message: `Invalid question type: ${questionType}` });
      }

      if (questionType === 'descriptive' && !q.correctAnswer) {
        return res.status(400).json({ message: 'Descriptive questions must have a correctAnswer.' });
      }

      if ((questionType === 'one-choice' || questionType === 'multiple-choice')) {
        if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
          return res.status(400).json({ message: 'MCQ questions must have options.' });
        }

        const hasCorrect = q.options.some(opt => opt.isCorrect === true);
        if (!hasCorrect) {
          return res.status(400).json({ message: 'At least one option must be marked correct.' });
        }
      }
    }

    // Create the test
    const newTest = new Test({
      name: name.trim(),
      teacher,
      questions,
      password,
      scheduledTime: new Date(scheduledTime),
      durationMinutes,
      targetSection: targetSection?.trim(),
    });

    const savedTest = await newTest.save();
    return res.status(201).json({ message: 'Test created successfully.', test: savedTest });

  } catch (err) {
    console.error('Error creating test:', err);
    return res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};



export const getAllTests = async (req, res) => {
  try {
    const teacherId = req.user?.id;

    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher not authenticated.' });
    }
    console.log('Fetching tests for teacher:', teacherId);
    // Fetch tests created by this teacher, sorted newest first
    const tests = await Test.find({ teacher: teacherId })
      .select('_id name scheduledTime durationMinutes isPublished createdAt') // select needed fields only
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ tests });
  } catch (err) {
    console.error('Error fetching tests:', err);
    return res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};


export const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user?.id;
    console.log('Fetching test by ID:', id, 'for teacher:', teacherId);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid test ID.' });
    }

    const test = await Test.findOne({ _id: id, teacher: teacherId });
    if (!test) {
      return res.status(404).json({ message: 'Test not found.' });
    }

    return res.status(200).json({ test });
  } catch (err) {
    console.error('Error fetching test by ID:', err);
    return res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};





export const updateTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const updatedFields = req.body;

    const updatedTest = await Test.findByIdAndUpdate(testId, updatedFields, { new: true });

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json({ message: 'Test updated successfully', test: updatedTest });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



// Add this export to your examController.js

export const deleteTestById = async (req, res) => {
  try {
    const { testId } = req.params;

    const deletedTest = await Test.findByIdAndDelete(testId);

    if (!deletedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    return res.status(200).json({ message: 'Test deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
