import { connectDB } from "@/lib/db";
import Lecture from "@/models/Lecture";
import LectureUploadForm from "@/app/components/admin/LectureUploadForm";
import DeleteLectureButton from "@/app/components/admin/DeleteLectureButton";
import { Video, Trash2, Calendar, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLecturesPage() {
  await connectDB();
  
  // Pull all active lectures directly to display next to the creation form
  const lectures = await Lecture.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-serif">
          Lecture Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload, audit, or remove recorded video modules from active training tracks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Column 1 & 2: Creation Workspace (Takes 2 spaces on desktop layout) */}
        <div className="lg:col-span-2">
          <LectureUploadForm />
        </div>

        {/* Column 3: Live Feed & Auditing Panel (Takes 1 space) */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4 max-h-[600px] overflow-y-auto">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Video size={16} className="text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active Broadcasts ({lectures.length})</h3>
          </div>

          {lectures.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-light text-xs">
              No recorded lectures found in database cluster collections.
            </div>
          ) : (
            <div className="space-y-3">
              {lectures.map((lecture: any) => (
                <div key={lecture._id.toString()} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start justify-between gap-3 group transition-all hover:border-slate-200">
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate pr-2">{lecture.name}</h4>
                    
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1 text-blue-600 uppercase text-[9px] font-mono font-bold tracking-wider">
                        <Globe size={10} /> {lecture.domain === "GLOBAL_COMMON" ? "GLOBAL" : "TRACK"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> {new Date(lecture.sessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Client interaction button to trigger database deletions */}
                  <DeleteLectureButton id={lecture._id.toString()} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}