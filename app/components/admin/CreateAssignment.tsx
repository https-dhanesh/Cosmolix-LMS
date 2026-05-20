"use client";
import { useState } from "react";
import { FileText, Save, Loader2, CheckCircle } from "lucide-react";

export default function CreateAssignment() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error || "Failed to post assignment"}`);
      }
    } catch (err) {
      console.error("Assignment Post Error:", err);
      alert("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
            <FileText size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Post New Assignment</h2>
        </div>
        {success && (
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold animate-bounce">
            <CheckCircle size={14} /> Published Successfully
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assignment Title</label>
        <input 
          name="title" 
          required 
          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" 
          placeholder="e.g. Portfolio Website Development" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instructions</label>
        <textarea 
          name="description" 
          rows={4} 
          required 
          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" 
          placeholder="Detailed tasks, requirements, and submission guidelines..." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Domain</label>
          <select 
            name="domain" 
            required 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="Full Stack Web Development">Full Stack Web Development</option>
            <option value="Machine Learning & AI">Machine Learning & AI</option>
            <option value="Cybersecurity & Ethical Hacking">Cybersecurity & Ethical Hacking</option>
            <option value="Mobile App Development">Mobile App Development</option>
            <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
            <option value="Data Science & Analytics">Data Science & Analytics</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline Date</label>
          <input 
            name="dueDate" 
            type="date" 
            required 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" 
          />
        </div>
      </div>

      <button 
        disabled={loading}
        className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Post Assignment</>}
      </button>
    </form>
  );
}