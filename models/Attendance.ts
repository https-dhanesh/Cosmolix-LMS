import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  sessionId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  checkInTime: Date;
  ipAddress?: string;
  isVerified: boolean;
  deviceInfo?: string;
}

const AttendanceSchema = new Schema<IAttendance>({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  checkInTime: { type: Date, default: Date.now },
  ipAddress: { type: String },
  isVerified: { type: Boolean, default: false },
  deviceInfo: { type: String }
}, { timestamps: true });

AttendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);