"use client";

import { useState, useEffect } from "react";
import { ITenant } from "@/models/Tenant";
import { Building2, Plus, Pencil, ToggleLeft, Trash2, X, GraduationCap, Loader2 } from "lucide-react";

const STYLES = `
  #college-page-root {
    --s: #F4F6FA; --b: #2B5BDB; --bl: #4B79F5; --t: #00C9A7; --tl: #0EA88D;
    --m: #64748B; --ml: #94A3B8; --g: linear-gradient(135deg,#2B5BDB 0%,#00C9A7 100%);
    --fd: 'Playfair Display', Georgia, serif; --fb: 'DM Sans', system-ui, sans-serif; --fm: 'DM Mono', monospace;
  }
  #college-page-root .gt { background: var(--g); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  #college-page-root .page-container { min-height: 100vh; font-family: var(--fb); -webkit-font-smoothing: antialiased; }
  #college-page-root .page-head { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E2E8F0; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  #college-page-root .page-eyebrow { font-family: var(--fm); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--t); display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
  #college-page-root .page-eyebrow span { width: 5px; height: 5px; border-radius: 50%; background: var(--t); }
  #college-page-root .page-title { font-family: var(--fd); font-size: clamp(24px, 4vw, 34px); font-weight: 700; color: #0F172A; letter-spacing: -.02em; line-height: 1.1; }
  #college-page-root .card { background: #fff; border: 1px solid #E2E8F0; border-radius: 24px; overflow: hidden; position: relative; box-shadow: 0 1px 4px rgba(15,23,42,.06); }
  #college-page-root .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--g); }
  #college-page-root .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  @media(max-width: 768px) { #college-page-root .form-grid { grid-template-columns: 1fr; } }
  #college-page-root .field { display: flex; flex-direction: column; gap: 6px; }
  #college-page-root .field label { font-family: var(--fm); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--m); }
  #college-page-root .field input { background: #F8FAFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 16px; font-size: 14px; outline: none; transition: all .2s; }
  #college-page-root .field input:focus { border-color: var(--b); background: #fff; box-shadow: 0 0 0 4px rgba(43,91,219,0.1); }
  #college-page-root .btn-primary { background: var(--b); color: #fff; font-weight: 600; padding: 12px 24px; border-radius: 12px; transition: all .2s; }
  #college-page-root .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(43,91,219,0.2); }
  #college-page-root table { width: 100%; border-collapse: collapse; }
  #college-page-root th { padding: 16px; font-family: var(--fm); font-size: 10px; color: var(--m); text-align: left; border-bottom: 1px solid #E2E8F0; }
  #college-page-root td { padding: 16px; border-bottom: 1px solid #F1F5F9; font-size: 14px; }
  #college-page-root .badge { padding: 4px 12px; border-radius: 99px; font-family: var(--fm); font-size: 10px; font-weight: bold; text-transform: uppercase; }
  #college-page-root .badge-active { background: #E0F8F4; color: #0D7A63; }
  #college-page-root .badge-inactive { background: #FEE2E2; color: #B91C1C; }
`;

export default function ManageCollegesPage() {
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [formData, setFormData] = useState({ name: "", code: "", contactEmail: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTenants = async () => {
    const res = await fetch("/api/tenants");
    if (res.ok) setTenants(await res.json());
  };

  useEffect(() => { fetchTenants(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `/api/tenants/${editingId}` : "/api/tenants";
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ name: "", code: "", contactEmail: "" });
        setEditingId(null);
        fetchTenants();
      }
    } catch (error) {
      console.error("Operation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will affect all associated students.")) return;
    const res = await fetch(`/api/tenants/${id}`, { method: "DELETE" });
    if (res.ok) fetchTenants();
  };

  return (
    <div id="college-page-root">
      <style>{STYLES}</style>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@500&display=swap" rel="stylesheet" />
      
      <div className="page-container">
        <div className="page-head">
          <div>
            <p className="page-eyebrow"><span />Infrastructure</p>
            <h1 className="page-title">Manage <span className="gt">Colleges</span></h1>
            <p className="text-sm text-slate-400 mt-2 font-mono uppercase tracking-tighter">
              {tenants.length} institutions onboarded
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="card mb-8">
          <div className="p-8 border-b border-slate-50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">{editingId ? "Update Institution" : "Register Institution"}</h2>
              <p className="text-xs text-slate-400">Configure college profiles and system access</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">
              <div className="field">
                <label>College Name</label>
                <input required placeholder="e.g. VIT Vellore" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="field">
                <label>College Code</label>
                <input required placeholder="e.g. VIT-01" className="uppercase" value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })} />
              </div>
              <div className="field">
                <label>Contact Email</label>
                <input type="email" placeholder="admin@univ.edu" value={formData.contactEmail}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} />
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                {editingId ? "Save Changes" : "Register College"}
              </button>
              {editingId && (
                <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="card">
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Institution</th>
                  <th>Unique Code</th>
                  <th>Status</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={String(t._id)}>
                    <td className="font-bold text-slate-900">{t.name}</td>
                    <td className="font-mono text-blue-600 text-xs">{t.code}</td>
                    <td>
                      <span className={`badge ${t.isActive ? 'badge-active' : 'badge-inactive'}`}>
                        {t.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          setEditingId(String(t._id));
                          setFormData({ name: t.name, code: t.code, contactEmail: t.contactEmail });
                        }} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(String(t._id))} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
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