"use client";
import { useEffect, useState } from "react";
import { Video, Lock } from "lucide-react";

const formatStableDate = (dateInput: string | Date) => {
  const d = new Date(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function SessionCard({ session }: { session: any }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkActive = () => {
      const now = new Date();
      const scheduledTime = new Date(session.scheduledAt);
      const diff = (scheduledTime.getTime() - now.getTime()) / 60000;
      
      setIsActive(diff <= 10 && session.status !== 'completed');
    };

    checkActive();
    const interval = setInterval(checkActive, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const handleJoin = async () => {
    try {
      const res = await fetch("/api/attendance/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: session._id }),
      });

      if (res.ok) {
        const data = await res.json();
        window.open(data.meetLink, "_blank");
      }
    } catch (err) {
      console.error("Failed to join session:", err);
    }
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">
          {session.domain}
        </span>
        <span className="text-slate-400 text-xs italic">
          {formatStableDate(session.scheduledAt)}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-2">{session.title}</h3>
      <p className="text-slate-500 text-sm mb-6 line-clamp-2">{session.description}</p>

      {isActive ? (
        <button 
          onClick={handleJoin}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 animate-pulse"
        >
          <Video className="w-4 h-4" /> Join Session Now
        </button>
      ) : (
        <button disabled className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
          <Lock className="w-4 h-4" /> Locked until Start
        </button>
      )}
    </div>
  );
}