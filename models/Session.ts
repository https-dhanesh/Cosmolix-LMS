import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  tenantId: mongoose.Types.ObjectId;
  domain: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  meetLink: string;
  youtubeVideoId?: string;
  status: 'scheduled' | 'live' | 'completed';
  createdBy: mongoose.Types.ObjectId;
}

const SessionSchema = new Schema<ISession>({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: false },
  domain: { type: String, required: false, default: null },
  title: { type: String, required: true },
  description: { type: String },
  scheduledAt: { type: Date, required: true },
  meetLink: { type: String, required: true },
  youtubeVideoId: { type: String }, 
  status: { 
    type: String, 
    enum: ['scheduled', 'live', 'completed'], 
    default: 'scheduled' 
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

SessionSchema.index({ tenantId: 1, domain: 1, status: 1 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);