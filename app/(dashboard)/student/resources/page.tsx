import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import { PlayCircle, FileText, Search } from "lucide-react";

export default async function ResourcesPage() {
  const { sessionClaims } = await auth();
  const domain = sessionClaims?.metadata?.domain as string;

  await connectDB();

  const recordings = await Session.find({ 
    domain: domain, 
    status: "completed" 
  }).sort({ scheduledAt: -1 }).lean();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Learning Resources</h1>
        <p className="text-slate-500">Access past recordings and study materials for {domain}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recordings.length > 0 ? (
          recordings.map((session: any) => (
            <div key={session._id.toString()} className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                <PlayCircle className="text-slate-300 w-12 h-12 group-hover:text-blue-600 transition-colors" />
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-bold">
                  RECORDING
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 mb-1 leading-snug">{session.topic}</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Held on {new Date(session.scheduledAt).toLocaleDateString()}
                </p>
                <a 
                  href={`https://www.youtube.com/watch?v=${session.youtubeVideoId}`} 
                  target="_blank"
                  className="block w-full py-3 bg-slate-50 text-slate-900 text-center rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                  Watch Lecture
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No recordings found for your track yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}