"use client";
import { BookOpen, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

interface AssignmentListProps {
  assignments: any[];
  submissions: any[];
}

const formatStableDate = (dateInput: string | Date) => {
  const d = new Date(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function AssignmentList({ assignments, submissions }: AssignmentListProps) {
  const submittedIds = new Set(submissions.map(s => s.assignmentId.toString()));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-800">Assignments</h2>
      </div>

      <div className="grid gap-4">
        {assignments.map((task) => {
          const isSubmitted = submittedIds.has(task._id.toString());
          const isLate = new Date() > new Date(task.dueDate) && !isSubmitted;

          return (
            <div 
              key={task._id.toString()} 
              className="group p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 transition-all flex items-center justify-between"
            >
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {task.title}
                </h4>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    Due: {formatStableDate(task.dueDate)}
                  </span>
                  
                  {isSubmitted ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                      <CheckCircle2 className="w-3 h-3" /> Submitted
                    </span>
                  ) : isLate ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase">
                      <AlertCircle className="w-3 h-3" /> Overdue
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              <Link 
                href={`/student/assignments/${task._id}`}
                className="px-4 py-2 text-sm font-bold bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
              >
                {isSubmitted ? "View Result" : "Open Task"}
              </Link>
            </div>
          );
        })}

        {assignments.length === 0 && (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">No assignments posted for your domain.</p>
          </div>
        )}
      </div>
    </div>
  );
}