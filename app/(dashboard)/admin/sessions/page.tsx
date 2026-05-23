import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import CreateSession from "@/app/components/admin/CreateSession";
import EndSessionButton from "@/app/components/admin/EndSessionButton";
import { Video, Calendar, Clock, ExternalLink, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const formatStableDate = (dateInput: string | Date) => {
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  });
};

const formatStableTime = (dateInput: string | Date) => {
  const d = new Date(dateInput);
  return d.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata' 
  });
};

export default async function AdminSessionsPage() {
  await connectDB();

  const sessions = await Session.find({}).sort({ scheduledAt: -1 }).lean();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Live Sessions</h1>
          <p className="text-slate-500">Schedule and manage domain-specific internship meetings.</p>
        </div>
        <CreateSession />
      </div>

      <div className="grid gap-4">
        {sessions.length > 0 ? (
          sessions.map((session: any) => (
            <div key={session._id.toString()} className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Video size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{session.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {formatStableDate(session.scheduledAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {formatStableTime(session.scheduledAt)}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase text-slate-600">
                      {session.domain || "Common to All"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-end border-t sm:border-0 pt-4 sm:pt-0">
                {session.status === "completed" ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                    <CheckCircle size={14} /> Ended
                  </span>
                ) : (
                  <>
                    <EndSessionButton sessionId={session._id.toString()} />
                    <a href={session.meetLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm">
                      Join Session <ExternalLink size={14} />
                    </a>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white text-slate-400 font-medium">
            No active or historical lecture sessions found. Schedule one above to go live.
          </div>
        )}
      </div>
    </div>
  );
}