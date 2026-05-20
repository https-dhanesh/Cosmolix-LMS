"use client";
import { useState } from "react";
import { Send, Link as LinkIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubmitAssignment({ assignmentId, isUpdate }: { assignmentId: string; isUpdate?: boolean }) {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignmentId, submissionLink: link }),
      });

      if (res.ok) {
        setStatus("success");
        setLink("");
        router.refresh();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        {isUpdate ? "Modify Your Submission" : "Submit Your Work"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            required
            type="url"
            placeholder={isUpdate ? "Paste your updated work URL" : "Paste GitHub or Google Drive link"}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        
        <button
          disabled={loading || status === "success"}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            status === "success" 
            ? "bg-green-100 text-green-600" 
            : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : status === "success" ? (
            "Successfully Updated!"
          ) : (
            <>
              <Send className="w-4 h-4" /> {isUpdate ? "Update Submission" : "Submit Assignment"}
            </>
          )}
        </button>
        
        {status === "error" && (
          <p className="text-xs text-red-500 text-center font-medium">
            Submission failed. Check deadline constraints or your system network configuration.
          </p>
        )}
      </form>
    </div>
  );
}