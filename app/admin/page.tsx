import { connectDB } from "@/lib/db";
import Tenant from "@/models/Tenant";
import User from "@/models/User";
// 1. Added Briefcase to the lucide-react imports
import { School, Users, Activity, BarChart3, Briefcase } from "lucide-react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@500&display=swap');
:root{--s:#0F172A;--b:#2B5BDB;--bl:#4B79F5;--t:#00C9A7;--m:#64748B;--ml:#94A3B8;--rs:rgba(255,255,255,.12);--bd:#D8DCE8;--g:linear-gradient(135deg,#2B5BDB 0%,#00C9A7 100%);--fd:'Playfair Display',Georgia,serif;--fb:'DM Sans',system-ui,sans-serif;--fm:'DM Mono',monospace}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--fb);background:#F4F6FA;-webkit-font-smoothing:antialiased}
.gt{background:var(--g);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
/* PAGE */
.dash{padding:2.5rem 2rem;max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:2.5rem}
/* HEADER ROW */
.dh{display:flex;align-items:flex-end;justify-content:space-between;gap:1.5rem;flex-wrap:wrap}
.dh-eyebrow{font-family:var(--fm);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--b);margin-bottom:8px}
.dh-title{font-family:var(--fd);font-size:clamp(26px,3.5vw,36px);font-weight:700;color:#111418;line-height:1.1;letter-spacing:-.02em}
.dh-sub{font-size:13.5px;color:var(--m);margin-top:6px;font-weight:300}
.live-pill{display:inline-flex;align-items:center;gap:7px;background:#F0FDF4;color:#15803D;border:1px solid #BBF7D0;padding:7px 14px;border-radius:999px;font-size:11.5px;font-weight:600;letter-spacing:.02em;flex-shrink:0}
.live-dot{width:7px;height:7px;border-radius:50%;background:#22C55E;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
/* STAT CARDS */
/* 2. Updated grid-template-columns to 4 to fit the new card perfectly */
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5px;background:var(--bd);border:1px solid var(--bd);border-radius:16px;overflow:hidden}
@media(max-width:900px){.cards{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.cards{grid-template-columns:1fr}}
.sc{background:#fff;padding:2rem 1.75rem;position:relative;overflow:hidden;transition:background-color .2s}
.sc:hover{background:#F8FAFF}
.sc::after{content:'';position:absolute;bottom:0;left:1.75rem;right:1.75rem;height:2px;background:var(--g);transform:scaleX(0);transform-origin:left;transition:transform .3s ease}
.sc:hover::after{transform:scaleX(1)}
.sc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.5rem}
.sc-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ic-blue{background:#EBF0FD;color:#2B5BDB}
.ic-teal{background:#E0F8F4;color:#0EA88D}
.ic-slate{background:#F1F5F9;color:#64748B}
.sc-trend{font-family:var(--fm);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ml);text-align:right;line-height:1.4;max-width:80px}
.sc-label{font-family:var(--fm);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--m);margin-bottom:6px}
.sc-value{font-family:var(--fd);font-size:clamp(36px,4vw,48px);font-weight:700;color:#111418;line-height:1}
/* EMPTY STATE */
.empty{background:#fff;border:1px solid var(--bd);border-radius:14px;padding:4rem 2rem;display:flex;flex-direction:column;align-items:center;text-align:center;gap:1rem}
.empty-icon{width:64px;height:64px;background:#F8FAFC;border:1px solid var(--bd);border-radius:14px;display:flex;align-items:center;justify-content:center;color:#CBD5E1}
.empty-title{font-family:var(--fd);font-size:22px;font-weight:700;color:#111418;letter-spacing:-.01em}
.empty-sub{font-size:13.5px;color:var(--m);max-width:380px;line-height:1.65;font-weight:300}
.empty-tag{font-family:var(--fm);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ml);border:1px solid var(--bd);padding:4px 10px;border-radius:4px;margin-top:.25rem}
`;

export default async function AdminDashboard() {
  await connectDB();
  
  // Only count entities that are NOT deleted
  const collegeCount = await Tenant.countDocuments({ isDeleted: false });
  const studentCount = await User.countDocuments({ role: "student", isDeleted: false });
  // 3. New DB query to fetch the teacher count
  const teacherCount = await User.countDocuments({ role: "teacher", isDeleted: false });

  return (
    <>
      <style>{S}</style>
      <div className="dash">

        {/* ── HEADER ── */}
        <div className="dh">
          <div>
            <p className="dh-eyebrow">Admin · Master Overview</p>
            <h1 className="dh-title">
              Platform <span className="gt">Dashboard</span>
            </h1>
            <p className="dh-sub">Real-time visibility across all colleges and cohorts.</p>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="cards">
          <StatCard
            label="Total Colleges"
            value={collegeCount}
            icon={<School size={20} />}
            iconClass="ic-blue"
            trend={collegeCount === 0 ? "None yet" : `${collegeCount} registered`}
          />
          <StatCard
            label="Active Students"
            value={studentCount}
            icon={<Users size={20} />}
            iconClass="ic-teal"
            trend={studentCount === 0 ? "None enrolled" : "Live sync"}
          />
          {/* 4. The new Teacher Stat Card */}
          <StatCard
            label="Active Faculty"
            value={teacherCount}
            icon={<Briefcase size={20} />}
            iconClass="ic-blue"
            trend={teacherCount === 0 ? "None enrolled" : "Live sync"}
          />
          <StatCard
            label="Sprints Today"
            value={0}
            icon={<Activity size={20} />}
            iconClass="ic-slate"
            trend="No live tests"
          />
          
        </div>

        {/* ── ANALYTICS EMPTY STATE ── */}
        <div className="empty" role="status" aria-label="Analytics not yet available">
          <div className="empty-icon" aria-hidden="true">
            <BarChart3 size={28} />
          </div>
          <h2 className="empty-title">Analytics Engine Warming Up</h2>
          <p className="empty-sub">
            Attendance trends, test score distributions, and sprint performance charts
            will appear here once the first college and cohort go live.
          </p>
          <span className="empty-tag" aria-hidden="true">Awaiting first college onboarding</span>
        </div>

      </div>
    </>
  );
}

function StatCard({ label, value, icon, iconClass, trend }: {
  label: string; value: number; icon: React.ReactNode; iconClass: string; trend: string;
}) {
  return (
    <div className="sc">
      <div className="sc-top">
        <div className={`sc-icon ${iconClass}`} aria-hidden="true">{icon}</div>
        <span className="sc-trend">{trend}</span>
      </div>
      <p className="sc-label">{label}</p>
      <p className="sc-value">{value}</p>
    </div>
  );
}