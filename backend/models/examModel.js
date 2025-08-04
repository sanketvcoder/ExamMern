import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: { type: String, enum: ['one-choice', 'multiple-choice', 'descriptive'], required: true },
  options: [optionSchema],
  correctAnswer: { type: String },
  marks: { type: Number, required: true }
});

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [questionSchema],
  password: String,
  scheduledTime: Date,
  durationMinutes: Number,
  isPublished: { type: Boolean, default: false },
  isBooked: { type: Boolean, default: false },
  targetSection: String,
  createdAt: { type: Date, default: Date.now },
});

// ✅ Add this:
testSchema.pre('validate', function (next) {
  if (!this.questions || this.questions.length === 0) {
    return next(new Error('Test must contain at least one question.'));
  }

  for (const q of this.questions) {
    if (!q.questionText || typeof q.marks !== 'number') {
      return next(new Error('Each question must have questionText and marks.'));
    }

    if (['one-choice', 'multiple-choice'].includes(q.questionType)) {
      if (!q.options || q.options.length < 2) {
        return next(new Error('MCQ questions must have at least 2 options.'));
      }

      const correctCount = q.options.filter(opt => opt.isCorrect).length;

      if (q.questionType === 'one-choice' && correctCount !== 1) {
        return next(new Error('One-choice questions must have exactly one correct option.'));
      }

      if (q.questionType === 'multiple-choice' && correctCount < 1) {
        return next(new Error('Multiple-choice questions must have at least one correct option.'));
      }

      if (q.correctAnswer && q.correctAnswer.trim() !== '') {
        return next(new Error('MCQ questions should not have a descriptive correctAnswer.'));
      }
    }

    if (q.questionType === 'descriptive') {
      if (q.options && q.options.length > 0) {
        return next(new Error('Descriptive questions should not have options.'));
      }
    }
  }

  next();
});

export default mongoose.model('Test', testSchema);
