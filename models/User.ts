import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  role: 'cosmolix_admin' | 'teacher' | 'student';
  tenantId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  isActive: boolean;
  isDeleted: boolean;
}

const UserSchema = new Schema<IUser>({
  // 'unique: true' already creates the index, no need to declare it again at the bottom
  clerkId: { type: String, required: true, unique: true },
  role: { type: String, enum: ['cosmolix_admin', 'teacher', 'student'], default: 'student' },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.index({ tenantId: 1, role: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);