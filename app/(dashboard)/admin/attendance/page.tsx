import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import Session from "@/models/Session";
import AttendanceFilter from "@/app/components/admin/AttendanceFilter";
import { Users, Clock, CheckCircle2, Search, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

const formatStableDate = (dateInput: any) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Kolkata'
    });
};

const formatStableTime = (dateInput: any) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    return d.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata' 
    });
};

export default async function AdminAttendancePage({
    searchParams,
}: {
    searchParams: Promise<{ session?: string }>;
}) {
    await connectDB();

    const sessions = await Session.find({}).sort({ scheduledAt: -1 }).lean();
    const { session: selectedSessionId } = await searchParams;
    const query = selectedSessionId ? { sessionId: selectedSessionId } : {};
    
    const attendanceLogs = await Attendance.find(query)
        .populate("studentId", "name email domain")
        .populate("sessionId", "title domain")
        .sort({ checkInTime: -1 })
        .lean();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Internship Operations
                    </p>
                    <h1 className="text-4xl font-bold text-slate-900 font-serif">Attendance <span className="italic text-blue-600">Logs</span></h1>
                    <p className="text-slate-500 mt-1">Track student participation across live domain sessions.</p>
                </div>

                <div className="flex items-center gap-2">
                    <AttendanceFilter sessions={JSON.parse(JSON.stringify(sessions))} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3 text-slate-500 mb-2">
                        <Users size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Total Check-ins</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{attendanceLogs.length}</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Info</th>
                                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Session / Domain</th>
                                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check-in Time</th>
                                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {attendanceLogs.map((log: any) => (
                                <tr key={log._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-5">
                                        <p className="font-bold text-slate-900">{log.studentId?.name || "Unknown Student"}</p>
                                        <p className="text-xs text-slate-400">{log.studentId?.email || "N/A"}</p>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-sm font-medium text-slate-700">{log.sessionId?.title || "Deleted Session"}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase tracking-tighter">
                                            {log.studentId?.domain || "General"}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-slate-500">
                                        {log.checkInTime ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                                    <Calendar size={13} className="text-slate-400" />
                                                    {formatStableDate(log.checkInTime)}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                    <Clock size={13} className="text-slate-300" />
                                                    {formatStableTime(log.checkInTime)}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                                            <CheckCircle2 size={14} />
                                            Present
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {attendanceLogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center">
                                        <div className="flex flex-col items-center opacity-40">
                                            <Search size={48} className="mb-4 text-slate-300" />
                                            <p className="text-lg font-serif font-bold text-slate-900">No logs found</p>
                                            <p className="text-sm text-slate-500">No students have checked into this session yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}