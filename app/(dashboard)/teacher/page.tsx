import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import { Users, CheckCircle, AlertTriangle } from "lucide-react";

export default async function TeacherDashboard() {
  const { sessionClaims } = await auth();
  const tenantId = sessionClaims?.metadata?.tenantId;

  await connectDB();

  // 1. Get all students in this Teacher's college
  const students = await User.find({ tenantId, role: 'student' }).lean();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">College Monitoring</h1>
      <p className="text-slate-500 mb-10">Real-time overview of your students' internship progress.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Enrolled Students</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{students.length}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase">Student Name</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase">Domain</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((student: any) => (
              <tr key={student._id}>
                <td className="p-5 font-bold text-slate-900">{student.name || "Unknown"}</td>
                <td className="p-5 text-slate-500 font-medium">{student.domain}</td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}