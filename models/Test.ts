import mongoose, { Schema, Document } from 'mongoose';

export interface ITest extends Document {
  tenantId: mongoose.Types.ObjectId;
  domain: string;
  title: string;
  scheduledAt: Date;
  durationMinutes: number;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    marks: number;
  }[];
  status: 'draft' | 'scheduled' | 'live' | 'graded';
  maxMarks: number;
  createdBy: mongoose.Types.ObjectId;
}

const TestSchema = new Schema<ITest>({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  domain: { type: String, required: true },
  title: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 60 },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    marks: { type: Number, default: 1 }
  }],
  status: { 
    type: String, 
    enum: ['draft', 'scheduled', 'live', 'graded'], 
    default: 'draft' 
  },
  maxMarks: { type: Number },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

TestSchema.pre('save' as any, function (this: ITest, next: (err?: Error) => void) {
  this.maxMarks = this.questions.reduce((acc, q) => acc + q.marks, 0);
  next();
});

export default mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);