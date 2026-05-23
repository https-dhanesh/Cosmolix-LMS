"use client";
import { useState } from "react";
import { Video, Calendar, Globe, Send, Loader2 } from "lucide-react";

export default function CreateSession() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert("Session Scheduled Successfully!");
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Video size={20} /></div>
        <h2 className="text-xl font-bold text-slate-900">Schedule New Session</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Session Title</label>
          <input name="topic" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Intro to React" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Target Domain</label>
          <select name="domain" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
            <option value="GLOBAL_COMMON">Common to All (Global)</option>
            <option value="Full Stack Web Development">Full Stack Web Development</option>
            <option value="Machine Learning & AI">Machine Learning & AI</option>
            <option value="Cybersecurity & Ethical Hacking">Cybersecurity & Ethical Hacking</option>
            <option value="Mobile App Development">Mobile App Development</option>
            <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
            <option value="Data Science & Analytics">Data Science & Analytics</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Date & Time</label>
          <input name="scheduledAt" type="datetime-local" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Meet/Zoom Link</label>
          <input name="meetLink" type="url" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none" placeholder="https://meet.google.com/..." />
        </div>
      </div>

      <button disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
        {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Publish Session</>}
      </button>
    </form>
  );
}