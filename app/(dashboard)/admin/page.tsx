import { connectDB } from "@/lib/db";
import Tenant from "@/models/Tenant";
import User from "@/models/User";
import Session from "@/models/Session"; 
import Assignment from "@/models/Assignment"; 
import Lecture from "@/models/Lecture";
import { School, Users, Activity, BarChart3, FileText, Video, Plus } from "lucide-react";
import Link from "next/link"; 

export const dynamic = "force-dynamic";

const STYLES = `
  #admin-dash-root {
    --s:#0F172A; --b:#2B5BDB; --bl:#4B79F5; --t:#00C9A7; --m:#64748B; --ml:#94A3B8; --rs:rgba(255,255,255,.12); --bd:#D8DCE8; --g:linear-gradient(135deg,#2B5BDB 0%,#00C9A7 100%);
    --fd:'Playfair Display',Georgia,serif; --fb:'DM Sans',system-ui,sans-serif; --fm:'DM Mono',monospace;
  }
  #admin-dash-root .gt { background: var(--g); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  #admin-dash-root .dash-container { font-family: var(--fb); }
  
  /* 3. UPDATED TO REPEAT 5 COLUMNS FOR THE NEW STAT CARD */
  #admin-dash-root .cards-grid { display:grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: #E2E8F0; border: 1px solid #E2E8F0; border-radius: 24px; overflow: hidden; }
  @media(max-width: 1200px) { #admin-dash-root .cards-grid { grid-template-columns: repeat(3, 1fr); } }
  @media(max-width: 768px) { #admin-dash-root .cards-grid { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width: 480px) { #admin-dash-root .cards-grid { grid-template-columns: 1fr; } }

  #admin-dash-root .sc-card { background:#fff; padding: 2rem; position: relative; transition: all 0.2s; display: block; height: 100%; }
  #admin-dash-root .sc-card:hover { background: #F8FAFF; }
  #admin-dash-root .sc-value { font-family: var(--fd); font-size: 3rem; font-weight: 700; color: #111418; line-height: 1; margin-top: 0.5rem; }
  #admin-dash-root .empty-state { background: #fff; border: 1px solid #E2E8F0; border-radius: 32px; padding: 5rem 2rem; text-align: center; }
`;

export default async function AdminDashboard() {
  await connectDB();
  
  const [collegeCount, studentCount, teacherCount, sessionCount, assignmentCount, lectureCount] = await Promise.all([
    Tenant.countDocuments({ isDeleted: { $ne: true } }),
    User.countDocuments({ role: "student", isDeleted: { $ne: true } }),
    User.countDocuments({ role: "teacher", isDeleted: { $ne: true } }),
    Session.countDocuments({ status: { $ne: 'completed' } }), 
    Assignment.countDocuments({ isActive: true }),
    Lecture.countDocuments({}) // Catch total uploaded recordings
  ]);

  const hasData = sessionCount > 0 || assignmentCount > 0 || lectureCount > 0;

  return (
    <div id="admin-dash-root">
      <style>{STYLES}</style>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@500&display=swap" rel="stylesheet" />
      
      <div className="dash-container">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2 font-mono">Platform Control · Master Overview</p>
            <h1 className="text-4xl font-bold text-slate-900 font-serif">
              Master <span className="gt italic">Dashboard</span>
            </h1>
            <p className="text-slate-500 mt-2 font-light">Real-time visibility across all colleges and domain tracks.</p>
          </div>

          <Link 
            href="/admin/lectures" 
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl tracking-wide transition-all shadow-sm"
          >
            <Video size={14} className="text-red-400" />
            Manage Lectures
          </Link>
        </div>

        {/* Stat Grid */}
        <div className="cards-grid mb-12">
          <StatCard
            label="Institutions"
            value={collegeCount}
            icon={<School size={22} />}
            iconClass="bg-blue-50 text-blue-600"
            trend={`${collegeCount} Registered`}
          />
          <StatCard
            label="Total Students"
            value={studentCount}
            icon={<Users size={22} />}
            iconClass="bg-teal-50 text-teal-600"
            trend={`${studentCount} Enrolled`}
          />
          <StatCard
            label="Active Sessions"
            value={sessionCount}
            icon={<Activity size={22} />}
            iconClass="bg-orange-50 text-orange-600"
            trend="Live Tracking"
          />
          <StatCard
            label="Assignments"
            value={assignmentCount}
            icon={<FileText size={22} />}
            iconClass="bg-purple-50 text-purple-600"
            trend="Published Tasks"
          />
          {/* 6. INTEGRATED INTERACTIVE LECTURE METRIC CARD */}
          <Link href="/admin/lectures">
            <div className="sc-card border-l border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-xl bg-red-50 text-red-600">
                  <Video size={22} />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-blue-600 flex items-center gap-0.5">
                  Open Sub-Route <Plus size={8} />
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Recorded Lectures</p>
              <p className="sc-value">{lectureCount}</p>
            </div>
          </Link>
        </div>

        {/* Dashboard Content Toggle */}
        {!hasData ? (
          <div className="empty-state">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
              <BarChart3 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif mb-3">Analytics Engine Initializing</h2>
            <p className="text-slate-500 max-w-md mx-auto font-light leading-relaxed mb-6">
              Attendance trends, performance distributions, and cohort analytics 
              will populate here once you schedule your first live session or publish an assignment.
            </p>
            <span className="inline-block px-4 py-1.5 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Awaiting Content Creation
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-1">Activity Detected</h3>
               <p className="text-sm text-slate-500 mb-6">The platform is now processing live data across synchronized clusters.</p>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm text-slate-700 font-medium">Tracking {studentCount} students across active training paths.</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm text-slate-700 font-medium">Broadcasted {lectureCount} distinct architectural lectures.</span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, iconClass, trend }: any) {
  return (
    <div className="sc-card">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl ${iconClass}`}>
          {icon}
        </div>
        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">{trend}</span>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{label}</p>
      <p className="sc-value">{value}</p>
    </div>
  );
}