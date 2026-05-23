import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  domain: string;
  dueDate: Date;
  attachmentUrl?: string; // Optional Google Drive link for resources
  createdBy: mongoose.Types.ObjectId;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  domain: { type: String, required: false, default: null },
  dueDate: { type: Date, required: true },
  attachmentUrl: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);