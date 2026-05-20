import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import CreateAssignment from "@/app/components/admin/CreateAssignment";
import Link from "next/link";

const formatStableDate = (dateInput: string | Date) => {
  const d = new Date(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default async function AdminAssignmentsPage() {
  await connectDB();
  const assignments = await Assignment.find({}).sort({ createdAt: -1 });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Assignments</h1>
          <p className="text-slate-500">Publish tasks and resources for specific domains.</p>
        </div>
        <CreateAssignment />
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase">Title</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase">Domain</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase">Deadline</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assignments.map((asgn) => (
              <tr key={asgn._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5 font-bold text-slate-900">{asgn.title}</td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">
                    {asgn.domain}
                  </span>
                </td>
                <td className="p-5 text-sm text-slate-500">
                  {formatStableDate(asgn.dueDate)}
                </td>
                <td className="p-5">
                  <Link 
                    href={`/admin/assignments/${asgn._id}`}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}