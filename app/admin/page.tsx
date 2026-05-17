import { connectDB } from "@/lib/db";
import Tenant from "@/models/Tenant";
import User from "@/models/User";
import { School, Users, Activity, BarChart3, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  await connectDB();
  const collegeCount = await Tenant.countDocuments();
  const studentCount = await User.countDocuments({ role: 'student' });

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Master Overview</h1>
          <p className="text-slate-500 mt-2 font-medium">Monitoring the pulse of industrial excellence.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            System Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          label="Total Colleges" 
          value={collegeCount} 
          icon={<School className="w-6 h-6 text-blue-600" />} 
          accentColor="bg-blue-600"
          trend="+2 registered"
        />
        <StatCard 
          label="Active Students" 
          value={studentCount} 
          icon={<Users className="w-6 h-6 text-teal-500" />} 
          accentColor="bg-teal-500"
          trend="Real-time sync"
        />
        <StatCard 
          label="Sprints Today" 
          value={0} 
          icon={<Activity className="w-6 h-6 text-emerald-500" />} 
          accentColor="bg-emerald-500"
          trend="No live tests"
        />
      </div>

      {/* Analytics Section */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-12 text-center shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Analytics Engine Warming Up</h2>
        <p className="text-slate-500 max-w-md mx-auto mt-2">
          Detailed behavioral analytics and internship progress charts will appear here as soon as the first college goes live.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, accentColor, trend }: { label: string; value: number; icon: React.ReactNode; accentColor: string; trend: string }) {
  return (
    <div className="p-8 bg-white border border-slate-200 rounded-[24px] hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden group">
      {/* Subtle top-accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${accentColor} opacity-20`} />
      
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white group-hover:shadow-md transition-all">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-1">
          {trend}
        </span>
      </div>
      
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">{label}</p>
        <div className="flex items-baseline gap-3">
          <h2 className="text-5xl font-black text-slate-900 mt-1">{value}</h2>
          <TrendingUp className="w-5 h-5 text-emerald-500" />
        </div>
      </div>
    </div>
  );
}