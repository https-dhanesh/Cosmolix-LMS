import mongoose, { Schema, Document } from 'mongoose';

export interface ILecture extends Document {
  name: string;
  youtubeUrl: string;
  domain: string; 
  sessionDate: Date;
  createdAt: Date;
}

const LectureSchema = new Schema<ILecture>({
  name: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  domain: { type: String, required: true }, 
  sessionDate: { type: Date, required: true },
}, { timestamps: true });

LectureSchema.index({ domain: 1, sessionDate: -1 });

export default mongoose.models.Lecture || mongoose.model<ILecture>('Lecture', LectureSchema);