import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import User from "@/models/User";
import { Trophy, MessageSquare, ExternalLink, Search } from "lucide-react";
import Link from "next/link";

export default async function SubmissionHistoryPage() {
  const { userId } = await auth();
  await connectDB();

  const student = await User.findOne({ clerkId: userId });
  
  // Fetch submissions and populate the assignment details
  const history = await Submission.find({ studentId: student?._id })
    .populate("assignmentId", "title")
    .sort({ submittedAt: -1 })
    .lean();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Academic History</h1>
        <p className="text-slate-500 mt-1">Track your grades and instructor feedback.</p>
      </div>

      <div className="grid gap-6">
        {history.length > 0 ? (
          history.map((record: any) => (
            <div 
              key={record._id.toString()} 
              className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    {record.assignmentId?.title || "Assignment"}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Submission Details
                    <a href={record.submissionLink} target="_blank" className="text-slate-400 hover:text-blue-600">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Submitted on {new Date(record.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-8">
                  {/* Grade Section */}
                  <div className="text-center px-6 border-x border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Grade</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-black ${record.grade ? 'text-slate-900' : 'text-slate-300'}`}>
                        {record.grade || "—"}
                      </span>
                      <span className="text-xs text-slate-400">/ 10</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-4 py-2 rounded-2xl font-bold text-xs uppercase ${
                    record.status === 'graded' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {record.status}
                  </div>
                </div>
              </div>

              {/* Instructor Feedback Section */}
              {record.feedback && (
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-1">Instructor Feedback</p>
                    <p className="text-sm text-slate-600 italic">"{record.feedback}"</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center p-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="text-slate-300 w-6 h-6" />
            </div>
            <h2 className="text-slate-900 font-bold">No submissions yet</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
              Once you submit your first assignment and a teacher grades it, your results will appear here.
            </p>
            <Link href="/student" className="inline-block mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm">
                Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}