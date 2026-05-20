import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import Submission from "@/models/Submission";
import { ArrowLeft, Calendar, BookOpen, Inbox, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminAssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  
  const { id } = await params;
  const assignment = await Assignment.findById(id);

  if (!assignment) return notFound();

  // Metrics tracking for this specific assignment
  const totalSubmissions = await Submission.countDocuments({ assignmentId: id });
  const pendingGrading = await Submission.countDocuments({ assignmentId: id, status: "pending" });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/admin/assignments" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Assignments
      </Link>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <BookOpen size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">{assignment.domain}</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 font-serif">{assignment.title}</h1>
          </div>
          
          <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
              <Calendar size={14} /> Task Deadline
            </div>
            <p className="text-slate-900 font-bold">
              {new Date(assignment.dueDate).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        {/* Dashboard Metrics Bar for quick oversight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={20} /></div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Submissions</p>
              <p className="text-xl font-black text-slate-900">{totalSubmissions}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Inbox size={20} /></div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Awaiting Evaluation</p>
              <p className="text-xl font-black text-slate-900">{pendingGrading}</p>
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none pt-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Core Track Instructions</h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {assignment.description}
          </p>
        </div>
      </div>
    </div>
  );
}