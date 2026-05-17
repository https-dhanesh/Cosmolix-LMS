import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  code: string;
  contactEmail: string;
  domains: string[];
  isActive: boolean;
  isDeleted: boolean;
}

const TenantSchema = new Schema<ITenant>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  contactEmail: { type: String },
  domains: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }, // Required by architecture
}, { timestamps: true });

TenantSchema.index({ code: 1 });

export default mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);