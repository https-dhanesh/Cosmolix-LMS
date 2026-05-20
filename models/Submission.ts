import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  submissionLink: string;
  submittedAt: Date;
  status: 'pending' | 'reviewed' | 'graded';
  grade?: number;
  feedback?: string;
  gradedBy?: mongoose.Types.ObjectId;
}

const SubmissionSchema = new Schema<ISubmission>({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  submissionLink: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'graded'], 
    default: 'pending' 
  },
  grade: { type: Number, min: 0, max: 10 },
  feedback: { type: String },
  gradedBy: { type: Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);