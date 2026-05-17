import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  role: 'cosmolix_admin' | 'teacher' | 'student';
  tenantId?: mongoose.Types.ObjectId;
  domain?: string;
  name: string;
  email: string;
  enrolledAt?: Date;
  githubUrl?: string;
  driveEmail?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['cosmolix_admin', 'teacher', 'student'], 
    default: 'student',
    required: true 
  },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', default: null },
  domain: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  enrolledAt: { type: Date },
  githubUrl: { type: String },
  driveEmail: { type: String },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// Mandatory Indexes per Documentation [cite: 12, 19]
UserSchema.index({ clerkId: 1 });
UserSchema.index({ tenantId: 1, role: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ domain: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);