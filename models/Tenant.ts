import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  code: string;
  contactEmail: string;
  domains: string[];
  isActive: boolean;
}

const TenantSchema = new Schema<ITenant>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  contactEmail: { type: String },
  domains: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);