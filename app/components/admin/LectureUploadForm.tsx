'use client';

import { useState } from 'react';
import { Video, Calendar, Globe, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function LectureUploadForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/lectures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          youtubeUrl: data.youtubeUrl,
          domain: data.domain,
          sessionDate: data.sessionDate,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setSuccess(false), 4000);
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
        <div className="bg-red-50 p-2 rounded-lg text-red-600">
          <Video size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Publish Recorded Lecture</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Session Title</label>
          <input 
            name="name" 
            required 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
            placeholder="e.g. Advanced GitOps Pipelines" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Target Domain</label>
          <select 
            name="domain" 
            required 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 bg-white"
          >
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
          <label className="text-xs font-bold text-slate-500 uppercase">Recording Date</label>
          <input 
            name="sessionDate" 
            type="date" 
            required 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-600" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">YouTube Video URL</label>
          <input 
            name="youtubeUrl" 
            type="url" 
            required 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
            placeholder="https://www.youtube.com/watch?v=..." 
          />
        </div>
      </div>

      <button 
        disabled={loading} 
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-70"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : success ? (
          <>
            <CheckCircle2 size={18} className="text-emerald-400" />
            Lecture Published Successfully
          </>
        ) : (
          <>
            <Send size={18} />
            Publish Recording
          </>
        )}
      </button>
    </form>
  );
}