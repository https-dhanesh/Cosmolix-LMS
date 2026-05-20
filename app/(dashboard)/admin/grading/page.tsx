import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import Session from "@/models/Session";
import { CheckCircle, ExternalLink, User as UserIcon, History, Inbox, Star } from "lucide-react";
import GradeForm from "@/app/components/admin/GradeForm";
import Link from "next/link";

export default async function AdminGradingPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  await connectDB();
  const { view } = await searchParams;
  const isHistoryView = view === "history";

  // Fetch based on selected tab
  const submissions = await Submission.find({
    status: isHistoryView ? "graded" : "pending",
  })
    .populate("studentId", "name")
    .populate("assignmentId", "title")
    .sort(isHistoryView ? { updatedAt: -1 } : { submittedAt: 1 })
    .lean();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Grading Desk</h1>
          <p className="text-slate-500">Review, grade, and track internship task submissions.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <Link
            href="/admin/grading"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              !isHistoryView ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Inbox size={14} /> Open Inbox
          </Link>
          <Link
            href="/admin/grading?view=history"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isHistoryView ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History size={14} /> Grading History
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {submissions.map((sub: any) => (
          <div key={sub._id.toString()} className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col lg:flex-row gap-8 items-start shadow-sm hover:border-blue-200 transition-all">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <UserIcon className="text-slate-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{sub.studentId?.name || "Student"}</h3>
                  <p className="text-xs text-slate-400">
                    {isHistoryView ? `Graded on ${new Date(sub.updatedAt).toLocaleDateString()}` : `Submitted ${new Date(sub.submittedAt).toLocaleDateString()}`}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {sub.assignmentId?.title}
                </span>
                <div className="mt-4 flex items-center gap-2">
                  <a 
                    href={sub.submissionLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-200 transition-all"
                  >
                    View Submited Link <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* If it's history, show the score card instead of the form */}
            <div className="w-full lg:w-96">
              {isHistoryView ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                    <Star size={14} fill="currentColor" /> Awarded Score
                  </div>
                  <p className="text-3xl font-black text-slate-900">{sub.grade}<span className="text-sm text-slate-400">/10</span></p>
                  <p className="text-xs text-slate-500 italic font-medium">"{sub.feedback || "No feedback left."}"</p>
                </div>
              ) : (
                <GradeForm submissionId={sub._id.toString()} />
              )}
            </div>
          </div>
        ))}

        {submissions.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">List is empty</h3>
            <p className="text-slate-500 text-sm">No items matching this desk layout.</p>
          </div>
        )}
      </div>
    </div>
  );
}