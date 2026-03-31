import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  userAnswer: { type: String },
  score: { type: Number },
  feedback: { type: String },
  strengths: { type: String },
  weaknesses: { type: String },
  improvedAnswer: { type: String },
});

const InterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobRole: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  questions: [QuestionSchema],
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  overallScore: { type: Number },
}, { timestamps: true });

export default mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);
