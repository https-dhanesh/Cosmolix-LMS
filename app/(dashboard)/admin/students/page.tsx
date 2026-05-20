"use client";

import { useState, useEffect } from "react";
import { ITenant } from "@/models/Tenant";
import { Users, UserPlus, Search, Pencil, Trash2, X, GraduationCap, Loader2 } from "lucide-react";

const STYLES = `
  #student-mgmt-root {
    --s:#F4F6FA; --b:#2B5BDB; --bl:#4B79F5; --t:#00C9A7; --m:#64748B; --ml:#94A3B8; --g:linear-gradient(135deg,#2B5BDB 0%,#00C9A7 100%);
    --fd:'Playfair Display',Georgia,serif; --fb:'DM Sans',system-ui,serif; --fm:'DM Mono',monospace;
  }
  #student-mgmt-root .gt { background: var(--g); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  #student-mgmt-root .card { background:#fff; border:1px solid #E2E8F0; border-radius:24px; overflow:hidden; position:relative; box-shadow:0 1px 4px rgba(15,23,42,.06); margin-bottom: 2rem; }
  #student-mgmt-root .card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--g) }
  #student-mgmt-root .field label { font-family:var(--fm); font-size:10px; text-transform:uppercase; color:var(--m); letter-spacing:.12em; margin-bottom: 4px; display:block; }
  #student-mgmt-root .field input, #student-mgmt-root .field select { background:#F8FAFF; border:1px solid #E2E8F0; border-radius:12px; padding:12px 16px; font-size:14px; width:100%; outline:none; transition:all .2s; }
  #student-mgmt-root .field input:focus { border-color:var(--b); box-shadow:0 0 0 4px rgba(43,91,219,.12); background:#fff }
  #student-mgmt-root .badge-domain { background:#EBF0FD; color:#2B5BDB; border:1px solid #D6E2FB; padding:4px 10px; border-radius:8px; font-size:10px; font-weight:700; text-transform:uppercase; font-family:var(--fm); }
  #student-mgmt-root .search-input { width:100%; padding:10px 14px 10px 40px; border:1px solid #E2E8F0; border-radius:14px; font-size:13px; outline:none; transition:all .2s; }
  #student-mgmt-root .search-input:focus { border-color:var(--b); box-shadow:0 0 0 4px rgba(43,91,219,.08); }
`;

const DOMAINS = [
  "Full Stack Web Development",
  "Machine Learning & AI",
  "Cybersecurity & Ethical Hacking",
  "Mobile App Development",
  "Internet of Things (IoT)",
  "Data Science & Analytics"
];

export default function StudentEnrollmentPage() {
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "student", tenantId: "", domain: "" });

  const fetchTenants = async () => {
    const res = await fetch("/api/tenants");
    if (res.ok) setTenants((await res.json()).filter((t: ITenant) => t.isActive)); 
  };

  const fetchStudents = async () => {
    const res = await fetch("/api/users?role=student");
    if (res.ok) setStudents(await res.json());
  };

  useEffect(() => { fetchTenants(); fetchStudents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `/api/users/${editingId}` : "/api/users/enroll";
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: "", email: "", role: "student", tenantId: "", domain: "" });
        setEditingId(null);
        fetchStudents();
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.tenantId?.name && s.tenantId.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="student-mgmt-root">
      <style>{STYLES}</style>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@500&display=swap" rel="stylesheet" />
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-[#00C9A7] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7]" /> Academic Enrollment
            </p>
            <h1 className="text-4xl font-bold text-slate-900 font-serif">
              Manage <span className="gt italic">Students</span>
            </h1>
          </div>
          <div className="text-right">
             <p className="text-xs font-mono text-slate-400 uppercase tracking-tighter">{students.length} Total Participants</p>
          </div>
        </div>

        {/* Enrollment Form */}
        <div className="card">
          <div className="p-8 border-b border-slate-50 flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                {editingId ? <Pencil size={20} /> : <UserPlus size={20} />}
             </div>
             <div>
                <h3 className="font-bold text-slate-900">{editingId ? "Update Record" : "New Enrollment"}</h3>
                <p className="text-xs text-slate-400">Map students to institutions and learning tracks.</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="field">
                <label>Full Name</label>
                <input required placeholder="Student name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input required type="email" placeholder="email@address.com" value={formData.email} disabled={!!editingId} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="field">
                <label>College Assignment</label>
                <select required value={formData.tenantId} onChange={e => setFormData({ ...formData, tenantId: e.target.value })}>
                  <option value="">Select College...</option>
                  {tenants.map(t => <option key={String(t._id)} value={String(t._id)}>{t.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Learning Track (Domain)</label>
                <select required value={formData.domain} onChange={e => setFormData({ ...formData, domain: e.target.value })}>
                  <option value="">Select Domain...</option>
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="px-8 py-3.5 bg-[#2B5BDB] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-[#4B79F5] transition-all flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
                {editingId ? "Save Updates" : "Complete Enrollment"}
              </button>
              {editingId && (
                <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Table */}
        <div className="card">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><Users size={16} /></div>
              <h4 className="font-bold text-slate-900">Registered Students</h4>
            </div>
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" className="search-input" placeholder="Quick search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Domain</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map(s => (
                  <tr key={String(s._id)} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-bold text-slate-900">{s.name}</td>
                    <td className="p-5 text-sm text-slate-500">{s.email}</td>
                    <td className="p-5 text-xs font-mono text-blue-600">{s.tenantId?.name || "Global"}</td>
                    <td className="p-5"><span className="badge-domain">{s.domain}</span></td>
                    <td className="p-5">
                       <button onClick={() => {
                         setEditingId(String(s._id));
                         setFormData({ name: s.name, email: s.email, role: "student", tenantId: s.tenantId?._id || s.tenantId, domain: s.domain || "" });
                       }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}