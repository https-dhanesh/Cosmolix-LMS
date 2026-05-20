"use client";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GradeForm({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Crucial for PATCH requests
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // Use router.refresh() for a smoother "Single Page App" feel
        // It re-runs the Server Component data fetching (AdminGradingPage)
        router.refresh(); 
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error || "Failed to submit grade"}`);
      }
    } catch (err) {
      console.error("Grading Error:", err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grade (0-10)</label>
        <input 
          name="grade" 
          type="number" 
          min="0" 
          max="10" 
          required 
          className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feedback</label>
        <textarea 
          name="feedback" 
          rows={2} 
          className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Great work on the UI..."
        />
      </div>
      <button 
        disabled={loading} 
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Send size={14} /> Submit Grade</>}
      </button>
    </form>
  );
}