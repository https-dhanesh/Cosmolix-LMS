"use client";

import { useState, useEffect } from "react";
import { ITenant } from "@/models/Tenant";
import { Building2, Plus, Pencil, ToggleLeft, Trash2, X, GraduationCap } from "lucide-react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@500&display=swap');
:root{--s:#F4F6FA;--b:#2B5BDB;--bl:#4B79F5;--t:#00C9A7;--tl:#0EA88D;
--m:#64748B;--ml:#94A3B8;--g:linear-gradient(135deg,#2B5BDB 0%,#00C9A7 100%);
--fd:'Playfair Display',Georgia,serif;--fb:'DM Sans',system-ui,sans-serif;--fm:'DM Mono',monospace}
.gt{background:var(--g);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.page{min-height:100vh;background:var(--s);font-family:var(--fb);padding:2rem;-webkit-font-smoothing:antialiased}
.inner{max-width:1100px;margin:0 auto}
.page-head{margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid #E2E8F0;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.page-eyebrow{font-family:var(--fm);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--t);display:flex;align-items:center;gap:6px;margin-bottom:8px}
.page-eyebrow span{width:5px;height:5px;border-radius:50%;background:var(--t);flex-shrink:0}
.page-title{font-family:var(--fd);font-size:clamp(24px,4vw,34px);font-weight:700;color:#0F172A;letter-spacing:-.02em;line-height:1.1}
.page-count{font-family:var(--fm);font-size:11px;letter-spacing:.1em;color:var(--m);margin-top:6px}
.card{background:#fff;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;position:relative;box-shadow:0 1px 4px rgba(15,23,42,.06)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--g)}
.card-head{padding:1.25rem 1.5rem;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;gap:10px}
.card-icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ci-b{background:#EBF0FD;color:var(--b)}
.card-title{font-family:var(--fd);font-size:16px;font-weight:700;color:#0F172A}
.card-sub{font-size:12px;font-weight:300;color:var(--m);margin-top:1px}
.form-body{padding:1.5rem}
.form-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px}
@media(max-width:768px){.form-grid{grid-template-columns:1fr}}
.field{display:flex;flex-direction:column;gap:6px}
.field label{font-family:var(--fm);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--m)}
.field input{background:#F8FAFF;border:1px solid #E2E8F0;border-radius:7px;padding:10px 14px;font-family:var(--fb);font-size:13.5px;color:#1E293B;outline:none;transition:border-color .2s,box-shadow .2s}
.field input::placeholder{color:var(--ml)}
.field input:focus{border-color:var(--b);box-shadow:0 0 0 3px rgba(43,91,219,.12);background:#fff}
.field input.upper{text-transform:uppercase}
.form-actions{display:flex;gap:10px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:7px;font-family:var(--fb);font-size:13px;font-weight:600;padding:10px 20px;border-radius:7px;border:none;cursor:pointer;letter-spacing:.03em;transition:all .18s}
.btn-primary{background:var(--b);color:#fff}
.btn-primary:hover{background:var(--bl);transform:translateY(-1px);box-shadow:0 6px 20px rgba(43,91,219,.28)}
.btn-ghost{background:#F1F5F9;color:#475569;border:1px solid #E2E8F0}
.btn-ghost:hover{background:#E2E8F0;color:#1E293B}
.tbl-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse}
thead tr{background:#F8FAFF;border-bottom:1px solid #E2E8F0}
th{padding:12px 16px;font-family:var(--fm);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--m);text-align:left;white-space:nowrap}
tbody tr{border-bottom:1px solid #F1F5F9;transition:background .15s}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:#F8FAFF}
tbody tr.editing{background:#EBF0FD;border-left:2px solid var(--b)}
td{padding:14px 16px;font-size:13.5px;color:#475569}
td.name{font-family:var(--fb);font-weight:500;color:#0F172A;font-size:14px}
td.code{font-family:var(--fm);font-size:12px;color:var(--tl);letter-spacing:.08em}
.badge{display:inline-flex;align-items:center;gap:5px;font-family:var(--fm);font-size:10px;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border-radius:4px;font-weight:500}
.badge-active{background:#E0F8F4;color:#0D7A63;border:1px solid #A7EEE2}
.badge-inactive{background:#FEE2E2;color:#B91C1C;border:1px solid#FECACA}
.badge-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.dot-a{background:#00C9A7}.dot-i{background:#EF4444}
.act-cell{display:flex;align-items:center;gap:4px}
.act-btn{display:inline-flex;align-items:center;gap:5px;font-family:var(--fb);font-size:12px;font-weight:500;padding:6px 10px;border-radius:6px;border:none;cursor:pointer;transition:all .15s;white-space:nowrap}
.act-edit{background:#EBF0FD;color:var(--b)}
.act-edit:hover{background:#D6E2FB}
.act-toggle{background:#F1F5F9;color:#475569}
.act-toggle:hover{background:#E2E8F0;color:#1E293B}
.act-del{background:#FEE2E2;color:#B91C1C}
.act-del:hover{background:#FECACA}
.empty{padding:3.5rem 1rem;text-align:center}
.empty-icon{width:52px;height:52px;border-radius:12px;background:#F1F5F9;border:1px solid #E2E8F0;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:var(--ml)}
.empty-text{font-family:var(--fd);font-size:16px;color:#0F172A;margin-bottom:6px}
.empty-sub{font-size:13px;font-weight:300;color:var(--m)}
.mb2{margin-bottom:1.5rem}
`;

export default function ManageCollegesPage() {
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [formData, setFormData] = useState({ name: "", code: "", contactEmail: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTenants = async () => {
    const res = await fetch("/api/tenants");
    if (res.ok) setTenants(await res.json());
  };

  useEffect(() => { fetchTenants(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/tenants/${editingId}` : "/api/tenants";
    const method = editingId ? "PATCH" : "POST";
    
    // FIX: Added headers so the backend parses the JSON body
    const res = await fetch(url, { 
      method, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData) 
    });
    
    if (res.ok) {
      setFormData({ name: "", code: "", contactEmail: "" });
      setEditingId(null);
      fetchTenants();
    } else {
      alert(`Error ${editingId ? "updating" : "creating"} college.`);
    }
  };

  const handleEditClick = (tenant: ITenant) => {
    setEditingId(String(tenant._id));
    setFormData({ name: tenant.name, code: tenant.code, contactEmail: tenant.contactEmail });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", code: "", contactEmail: "" });
  };

  const handleToggle = async (id: string) => {
    const res = await fetch(`/api/tenants/${id}/toggle`, { method: "PATCH" });
    if (res.ok) fetchTenants();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this college?")) return;
    const res = await fetch(`/api/tenants/${id}`, { method: "DELETE" });
    if (res.ok) fetchTenants();
  };

  return (
    <>
      <style>{S}</style>
      <div className="page">
        <div className="inner">

          {/* Page Header */}
          <div className="page-head">
            <div>
              <p className="page-eyebrow"><span />Institution Management</p>
              <h1 className="page-title">
                Manage <span className="gt">Colleges</span>
              </h1>
              <p className="page-count">
                {tenants.length} {tenants.length === 1 ? "institution" : "institutions"} registered
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="card mb2">
            <div className="card-head">
              <div className="card-icon ci-b">
                {editingId ? <Pencil size={16} /> : <Plus size={16} />}
              </div>
              <div>
                <p className="card-title">{editingId ? "Edit College Details" : "Register New College"}</p>
                <p className="card-sub">{editingId ? "Update the institution's information below" : "Add a new institution to the platform"}</p>
              </div>
            </div>
            <div className="form-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="field">
                    <label>College Name</label>
                    <input required placeholder="e.g. MIT Pune" value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>College Code</label>
                    <input required placeholder="e.g. MIT-01" className="upper" value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Contact Email</label>
                    <input type="email" placeholder="admin@college.edu" value={formData.contactEmail}
                      onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? <Pencil size={14} /> : <Plus size={14} />}
                    {editingId ? "Update College" : "Create College"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={handleCancelEdit} className="btn btn-ghost">
                      <X size={14} /> Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Table Card */}
          <div className="card">
            <div className="card-head">
              <div className="card-icon ci-b"><Building2 size={16} /></div>
              <div>
                <p className="card-title">Registered Institutions</p>
                <p className="card-sub">Manage status and details for each college</p>
              </div>
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>College Name</th>
                    <th>Code</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((t) => (
                    <tr key={String(t._id)} className={editingId === String(t._id) ? "editing" : ""}>
                      <td className="name">{t.name}</td>
                      <td className="code">{t.code}</td>
                      <td>
                        <span className={`badge ${t.isActive ? "badge-active" : "badge-inactive"}`}>
                          <span className={`badge-dot ${t.isActive ? "dot-a" : "dot-i"}`} />
                          {t.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="act-cell">
                          <button onClick={() => handleEditClick(t)} className="act-btn act-edit">
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => handleToggle(String(t._id))} className="act-btn act-toggle">
                            <ToggleLeft size={12} /> Toggle
                          </button>
                          <button onClick={() => handleDelete(String(t._id))} className="act-btn act-del">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tenants.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        <div className="empty">
                          <div className="empty-icon"><GraduationCap size={22} /></div>
                          <p className="empty-text">No colleges registered yet</p>
                          <p className="empty-sub">Use the form above to add your first institution</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}