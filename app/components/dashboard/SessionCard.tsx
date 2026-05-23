"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Video, Calendar, Clock, ExternalLink, ShieldAlert, Loader2 } from "lucide-react";

interface SessionCardProps {
  session: {
    _id: string;
    title: string;
    description?: string;
    domain: string | null;
    scheduledAt: string | Date;
    meetLink: string;
    isLive: boolean; 
  };
}

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

export default function SessionCard({ session }: SessionCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const canJoin = session.isLive;

  const handleJoinSession = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session._id }),
      });

      const data = await res.json();

      if (res.ok && data.meetLink) {
        window.open(data.meetLink, "_blank", "noopener,noreferrer");
        router.refresh();
      } else {
        alert(data.error || "Could not log attendance entry.");
      }
    } catch (err) {
      console.error("Tracking connection failed", err);
      alert("Network error. Failed to log attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
      
      <div className={`absolute top-0 left-0 right-0 h-1 ${canJoin ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${canJoin ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
            <Video size={20} />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase tracking-wide text-slate-600 border border-slate-200/40">
              {session.domain || "Common to All"}
            </span>
            {canJoin && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
            {session.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[2rem] font-light leading-relaxed">
            {session.description || "No lecture syllabus summary notes provided for this meeting block."}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-50">
          <span className="flex items-center gap-1 font-medium">
            <Calendar size={13} className="text-slate-400" /> 
            {formatStableDate(session.scheduledAt)}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Clock size={13} className="text-slate-400" /> 
            {formatStableTime(session.scheduledAt)}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100">
        {!canJoin ? (
          <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-400 bg-slate-50 border border-slate-200/60 cursor-not-allowed">
            <ShieldAlert size={14} />
            Locked until start
          </div>
        ) : (
          <button
            onClick={handleJoinSession}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-sm shadow-blue-100 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Logging Attendance...
              </>
            ) : (
              <>
                Join Live Meeting
                <ExternalLink size={13} />
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
}