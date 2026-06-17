import LectureUploadForm from "@/app/components/admin/LectureUploadForm";

export const dynamic = "force-dynamic";

export default function AdminLecturesPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-serif">
          Lecture Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload, manage, and distribute recorded links to student domain tracks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <LectureUploadForm />

        <div className="p-6 bg-slate-50 border border-slate-200 border-dashed rounded-3xl h-full flex items-center justify-center text-center">
          <p className="text-xs text-slate-400 font-mono">
            Operational Live Feed Active
          </p>
        </div>
      </div>
    </div>
  );
}