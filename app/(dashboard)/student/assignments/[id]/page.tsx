import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import Submission from "@/models/Submission";
import User from "@/models/User";
import SubmitAssignment from "@/app/components/dashboard/SubmitAssignment";
import { ArrowLeft, Calendar, BookOpen, CheckCircle2, Star, MessageSquare, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { userId } = await auth();
  const { id } = await params;

  const assignment = await Assignment.findById(id);
  if (!assignment) return notFound();

  const student = await User.findOne({ clerkId: userId });
  const submission = await Submission.findOne({ 
    assignmentId: id, 
    studentId: student?._id 
  });

  const isBeforeDeadline = new Date() < new Date(assignment.dueDate);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/student" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Dashboard
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
              <Calendar size={14} /> Deadline
            </div>
            <p className="text-slate-900 font-bold">
              {new Date(assignment.dueDate).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none mb-12">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Instructions</h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{assignment.description}</p>
        </div>

        <div className="border-t border-slate-100 pt-10 space-y-6">
          {submission && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="text-xs font-medium text-slate-600">
                Current Active Submission Link:
                <p className="text-sm font-bold text-blue-600 break-all">{submission.submissionLink}</p>
              </div>
              <a href={submission.submissionLink} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600">
                <ExternalLink size={16} />
              </a>
            </div>
          )}

          {submission?.status === "graded" && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-500 text-white p-2 rounded-xl"><CheckCircle2 size={24} /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Grading Complete</h3>
                  <p className="text-sm text-emerald-700">Your instructor has reviewed your work.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Star size={14} className="text-amber-400" /> Final Score
                  </div>
                  <p className="text-4xl font-black text-slate-900">{submission.grade}<span className="text-lg text-slate-400">/10</span></p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <MessageSquare size={14} className="text-blue-400" /> Instructor Feedback
                  </div>
                  <p className="text-slate-700 italic font-medium">"{submission.feedback || "Great effort!"}"</p>
                </div>
              </div>
            </div>
          )}

          {submission?.status === "pending" && (
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 text-center">
              <h3 className="text-md font-bold text-slate-900 flex items-center justify-center gap-2">
                <Clock size={16} className="text-blue-500 animate-pulse" /> Awaiting Review
              </h3>
            </div>
          )}

          {isBeforeDeadline ? (
            <SubmitAssignment assignmentId={id} isUpdate={!!submission} />
          ) : (
            <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400 font-medium">
              The deadline has passed. Submission updates are permanently locked.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}