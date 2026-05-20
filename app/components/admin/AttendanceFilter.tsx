"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

export default function AttendanceFilter({ sessions }: { sessions: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSessionId = searchParams.get("session") || "";

  // 1. Add a mounted state to prevent hydration flickering
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const url = new URL(window.location.href);
    if (val) url.searchParams.set("session", val);
    else url.searchParams.delete("session");
    
    router.push(url.pathname + url.search);
  };

  // 2. Format function that is stable
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // Don't render the interactive parts until we are on the client
  if (!mounted) return <div className="h-10 w-48 bg-slate-100 animate-pulse rounded-xl" />;

  return (
    <div className="relative">
      <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <select 
        value={selectedSessionId}
        onChange={handleChange}
        className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
      >
        <option value="">All Sessions</option>
        {sessions.map((s) => (
          <option key={s._id.toString()} value={s._id.toString()}>
            {s.title} ({formatDate(s.scheduledAt)})
          </option>
        ))}
      </select>
    </div>
  );
}