import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import Assignment from "@/models/Assignment";
import Submission from "@/models/Submission";
import Attendance from "@/models/Attendance";
import User from "@/models/User";
import SessionCard from "@/app/components/dashboard/SessionCard";
import AssignmentList from "@/app/components/dashboard/AssignmentList";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Clock, LogOut, GraduationCap } from "lucide-react";

async function getAttendanceRate(studentId: string, domain: string) {
  const totalSessions = await Session.countDocuments({ domain: domain, status: "completed" });
  if (totalSessions === 0) return 0;
  const attendedSessions = await Attendance.countDocuments({ studentId: studentId });
  return Math.min(100, Math.round((attendedSessions / totalSessions) * 100));
}

export default async function StudentDashboard() {
  const { userId, sessionClaims } = await auth();
  const domain = sessionClaims?.metadata?.domain as string;

  await connectDB();
  const student = await User.findOne({ clerkId: userId });

  if (!student) {
    return (
      <div className="p-8 text-center mt-20">
        <h1 className="text-xl font-bold">Initializing Profile...</h1>
        <p className="text-slate-500">We're setting up your workspace. Please refresh in a moment.</p>
      </div>
    );
  }

  const sessions = await Session.find({
    domain: domain,
    status: { $ne: 'completed' },
    $or: [{ tenantId: student.tenantId }, { tenantId: null }]
  }).sort({ scheduledAt: 1 }).lean();

  const assignments = await Assignment.find({ domain: domain }).sort({ dueDate: 1 }).lean();
  const submissions = await Submission.find({ studentId: student._id }).select('assignmentId').lean();
  const attendanceRate = await getAttendanceRate(student._id.toString(), domain);

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-12">
      
      {/* GLOBAL DASHBOARD TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/10 backdrop-blur-md px-8 py-4 mb-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2B5BDB] to-[#00C9A7] flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>
            <span className="font-sans font-bold text-sm tracking-widest text-white uppercase">
              Cosmolix <span className="bg-gradient-to-r from-[#2B5BDB] to-[#00C9A7] bg-clip-text text-transparent">LMS</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 border border-white/20" } }} />
            <SignOutButton redirectUrl="/sign-in">
              <button type="button" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                <LogOut size={14} /> Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT BODY HUB CONTAINER */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-serif">Welcome Back, {student.name || "Student"}</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Current Learning Track: <span className="font-bold text-[#2B5BDB] uppercase tracking-wide">{domain || "Not Assigned"}</span>
            </p>
          </div>

          <div className="border border-slate-200/80 p-4 px-6 rounded-2xl flex items-center gap-4 bg-slate-50/50">
            <div className="bg-blue-50 p-2.5 rounded-xl">
              <Clock className="text-[#2B5BDB] w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attendance Rate</p>
              <p className="text-xl font-black text-slate-900">{attendanceRate}%</p>
            </div>
          </div>
        </div>

        {/* Dashboard Operational Grid columns layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Learning Schedule */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <LayoutDashboard className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Learning Schedule</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessions.length > 0 ? (
                sessions.map((session: any) => (
                  <SessionCard key={session._id.toString()} session={JSON.parse(JSON.stringify(session))} />
                ))
              ) : (
                <div className="col-span-full p-16 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white">
                  <p className="text-slate-400 font-medium">No live lectures or upcoming sessions found for your track.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Assignment Track */}
          <div className="bg-slate-50/40 p-1 rounded-[2.5rem] border border-slate-100 h-fit">
            <div className="bg-white p-6 rounded-[2.3rem] shadow-sm">
              <AssignmentList assignments={JSON.parse(JSON.stringify(assignments))} submissions={JSON.parse(JSON.stringify(submissions))} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}