import { connectDB } from "@/lib/db";
import Tenant from "@/models/Tenant";
import User from "@/models/User";
import { School, Users, BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

const STYLES = `
  #admin-dash-root {
    --s:#0F172A; --b:#2B5BDB; --bl:#4B79F5; --t:#00C9A7; --m:#64748B; --ml:#94A3B8; --rs:rgba(255,255,255,.12); --bd:#D8DCE8; --g:linear-gradient(135deg,#2B5BDB 0%,#00C9A7 100%);
    --fd:'Playfair Display',Georgia,serif; --fb:'DM Sans',system-ui,sans-serif; --fm:'DM Mono',monospace;
  }
  #admin-dash-root .gt { background: var(--g); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  #admin-dash-root .dash-container { font-family: var(--fb); }
  
  /* Reset to a clean 2-column layout for pure global stats */
  #admin-dash-root .cards-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: #E2E8F0; border: 1px solid #E2E8F0; border-radius: 24px; overflow: hidden; }
  @media(max-width: 640px) { #admin-dash-root .cards-grid { grid-template-columns: 1fr; } }

  #admin-dash-root .sc-card { background:#fff; padding: 2rem; position: relative; transition: all 0.2s; }
  #admin-dash-root .sc-card:hover { background: #F8FAFF; }
  #admin-dash-root .sc-value { font-family: var(--fd); font-size: 3rem; font-weight: 700; color: #111418; line-height: 1; margin-top: 0.5rem; }
  #admin-dash-root .empty-state { background: #fff; border: 1px solid #E2E8F0; border-radius: 32px; padding: 5rem 2rem; text-align: center; }
`;

export default async function AdminDashboard() {
  await connectDB();
  
  // Aggregate only institutional metrics
  const [collegeCount, studentCount] = await Promise.all([
    Tenant.countDocuments({ isDeleted: { $ne: true } }),
    User.countDocuments({ role: "student", isDeleted: { $ne: true } })
  ]);

  const hasData = studentCount > 0;

  return (
    <div id="admin-dash-root">
      <style>{STYLES}</style>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@500&display=swap" rel="stylesheet" />
      
      <div className="dash-container">
        {/* Header */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2 font-mono">Platform Control · Master Overview</p>
            <h1 className="text-4xl font-bold text-slate-900 font-serif">
              Master <span className="gt italic">Dashboard</span>
            </h1>
            <p className="text-slate-500 mt-2 font-light">Real-time visibility across all colleges and domain tracks.</p>
          </div>
        </div>

        {/* Minimal Stat Grid */}
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
        </div>

        {/* Operational Flow Metrics */}
        {!hasData ? (
          <div className="empty-state">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
              <BarChart3 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif mb-3">Analytics Engine Initializing</h2>
            <p className="text-slate-500 max-w-md mx-auto font-light leading-relaxed mb-6">
              Core multi-tenant enrollment distributions and workspace performance metrics 
              will populate here as student profile assets sync across system clusters.
            </p>
            <span className="inline-block px-4 py-1.5 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Awaiting Node Synchronization
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-1">System Operational</h3>
               <p className="text-sm text-slate-500 mb-6">The infrastructure layer is processing live structural components cleanly.</p>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm text-slate-700 font-medium">Monitoring {studentCount} active students inside structural paths.</span>
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