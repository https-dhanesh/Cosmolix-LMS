import mongoose, { Schema, Document } from 'mongoose';

const TestResultSchema = new Schema({
  testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  answers: [{
    questionIndex: Number,
    selectedOption: Number,
    isCorrect: Boolean
  }],
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
  timeTaken: Number // In minutes
}, { timestamps: true });

TestResultSchema.index({ testId: 1, studentId: 1 }, { unique: true });

export default mongoose.models.TestResult || mongoose.model('TestResult', TestResultSchema);