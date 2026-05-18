"use client";

import { useState, useEffect } from "react";
import { ITenant } from "@/models/Tenant";
import { Users, UserPlus, Search, Pencil, Trash2, X, GraduationCap } from "lucide-react";

// Reusing the exact same UI structure, adding a search bar style
const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@500&display=swap');
:root{--s:#F4F6FA;--b:#2B5BDB;--bl:#4B79F5;--t:#00C9A7;--m:#64748B;--ml:#94A3B8;--g:linear-gradient(135deg,#2B5BDB 0%,#00C9A7 100%);--fd:'Playfair Display',Georgia,serif;--fb:'DM Sans',system-ui,sans-serif;--fm:'DM Mono',monospace}
.gt{background:var(--g);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.page{min-height:100vh;background:var(--s);font-family:var(--fb);padding:2rem;-webkit-font-smoothing:antialiased}
.inner{max-width:1100px;margin:0 auto}
.page-head{margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid #E2E8F0;}
.page-eyebrow{font-family:var(--fm);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--t);display:flex;align-items:center;gap:6px;margin-bottom:8px}
.page-eyebrow span{width:5px;height:5px;border-radius:50%;background:var(--t);flex-shrink:0}
.page-title{font-family:var(--fd);font-size:clamp(24px,4vw,34px);font-weight:700;color:#0F172A;letter-spacing:-.02em;}
.card{background:#fff;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;position:relative;box-shadow:0 1px 4px rgba(15,23,42,.06); margin-bottom: 2rem;}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--g)}
.card-head{padding:1.25rem 1.5rem;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;justify-content:space-between;gap:10px}
.ch-left{display:flex;align-items:center;gap:10px;}
.card-icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; background:#EBF0FD;color:var(--b)}
.card-title{font-family:var(--fd);font-size:16px;font-weight:700;color:#0F172A}
.card-sub{font-size:12px;font-weight:300;color:var(--m);margin-top:1px}
.form-body{padding:1.5rem}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
.field{display:flex;flex-direction:column;gap:6px}
.field label{font-family:var(--fm);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--m)}
.field input, .field select {background:#F8FAFF;border:1px solid #E2E8F0;border-radius:7px;padding:10px 14px;font-family:var(--fb);font-size:13.5px;color:#1E293B;outline:none;transition:all .2s;}
.field input:focus, .field select:focus {border-color:var(--b);box-shadow:0 0 0 3px rgba(43,91,219,.12);background:#fff}
.form-actions{display:flex;gap:10px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:7px;font-family:var(--fb);font-size:13px;font-weight:600;padding:10px 20px;border-radius:7px;border:none;cursor:pointer;transition:all .18s}
.btn-primary{background:var(--b);color:#fff}
.btn-primary:hover{background:var(--bl);transform:translateY(-1px);box-shadow:0 6px 20px rgba(43,91,219,.28)}
.btn-primary:disabled{opacity:0.7;cursor:not-allowed;transform:none;box-shadow:none}
.btn-ghost{background:#F1F5F9;color:#475569;border:1px solid #E2E8F0}
.btn-ghost:hover{background:#E2E8F0;color:#1E293B}

/* Table & Search Styles */
.search-wrap{position:relative;width:280px;}
.search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--ml);}
.search-input{width:100%;padding:8px 12px 8px 34px;border:1px solid #E2E8F0;border-radius:6px;font-size:13px;outline:none;}
.search-input:focus{border-color:var(--b);}
.tbl-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse}
thead tr{background:#F8FAFF;border-bottom:1px solid #E2E8F0}
th{padding:12px 16px;font-family:var(--fm);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--m);text-align:left;white-space:nowrap}
tbody tr{border-bottom:1px solid #F1F5F9;transition:background .15s}
tbody tr:hover{background:#F8FAFF}
tbody tr.editing{background:#EBF0FD;border-left:2px solid var(--b)}
td{padding:14px 16px;font-size:13.5px;color:#475569}
td.name{font-family:var(--fb);font-weight:500;color:#0F172A;font-size:14px}
td.code{font-family:var(--fm);font-size:12px;color:var(--tl);letter-spacing:.08em}
.badge{display:inline-flex;align-items:center;padding:4px 8px;border-radius:4px;font-family:var(--fm);font-size:10px;font-weight:500;text-transform:uppercase;}
.badge-domain{background:#F8FAFF;color:#2B5BDB;border:1px solid #D6E2FB;}
.act-cell{display:flex;align-items:center;gap:8px}
.act-btn{display:inline-flex;align-items:center;gap:5px;font-family:var(--fb);font-size:12px;font-weight:500;padding:6px 10px;border-radius:6px;border:none;cursor:pointer;transition:all .15s;}
.act-edit{background:#EBF0FD;color:var(--b)}
.act-edit:hover{background:#D6E2FB}
.act-del{background:#FEE2E2;color:#B91C1C}
.act-del:hover{background:#FECACA}
.empty{padding:3.5rem 1rem;text-align:center}
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

  // The role is now hardcoded to 'student' automatically
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student", 
    tenantId: "",
    domain: ""
  });

  const fetchTenants = async () => {
    const res = await fetch("/api/tenants");
    if (res.ok) setTenants((await res.json()).filter((t: ITenant) => t.isActive)); 
  };

  const fetchStudents = async () => {
    // Only fetch users with the 'student' role
    const res = await fetch("/api/users?role=student");
    if (res.ok) setStudents(await res.json());
  };

  useEffect(() => {
    fetchTenants();
    fetchStudents();
  }, []);

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
        fetchStudents(); // Refresh the list
      } else {
        const error = await res.text();
        alert(`Action Failed: ${error}`);
      }
    } catch (error) {
      alert("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (student: any) => {
    setEditingId(String(student._id));
    setFormData({ 
      name: student.name, 
      email: student.email, 
      role: "student",
      tenantId: student.tenantId?._id || student.tenantId, // Safely extract ID if populated
      domain: student.domain || "" 
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", role: "student", tenantId: "", domain: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this student?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) fetchStudents();
  };

  // Search Filter Logic
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.tenantId?.name && s.tenantId.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <style>{S}</style>
      <div className="page">
        <div className="inner">
          <div className="page-head">
            <p className="page-eyebrow"><span />Participant Management</p>
            <h1 className="page-title">Manage <span className="gt">Students</span></h1>
          </div>

          {/* Form Card */}
          <div className="card">
            <div className="card-head">
              <div className="ch-left">
                <div className="card-icon">
                  {editingId ? <Pencil size={16} /> : <UserPlus size={16} />}
                </div>
                <div>
                  <p className="card-title">{editingId ? "Edit Student Details" : "Enroll New Student"}</p>
                  <p className="card-sub">Assign students to specific colleges and internship domains.</p>
                </div>
              </div>
            </div>
            
            <div className="form-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="field">
                    <label>Full Name</label>
                    <input required placeholder="e.g. Rahul Sharma" value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  
                  <div className="field">
                    <label>Email Address</label>
                    <input required type="email" placeholder="student@example.com" value={formData.email}
                      disabled={!!editingId} // Disable email edit for Clerk sync safety
                      onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>

                  <div className="field">
                    <label>Assigned College</label>
                    <select required value={formData.tenantId} onChange={e => setFormData({ ...formData, tenantId: e.target.value })}>
                      <option value="" disabled>Select a College...</option>
                      {tenants.map(t => (
                        <option key={String(t._id)} value={String(t._id)}>
                          {t.name} ({t.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Internship Domain</label>
                    <select required value={formData.domain} onChange={e => setFormData({ ...formData, domain: e.target.value })}>
                      <option value="" disabled>Select Internship Track...</option>
                      {DOMAINS.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Processing..." : (editingId ? "Update Student" : "Enroll Student")}
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

          {/* Student List Table */}
          <div className="card">
            <div className="card-head">
              <div className="ch-left">
                <div className="card-icon"><Users size={16} /></div>
                <div>
                  <p className="card-title">Enrolled Students</p>
                  <p className="card-sub">{students.length} total students tracked across the platform.</p>
                </div>
              </div>
              {/* Search Bar */}
              <div className="search-wrap">
                <Search size={14} className="search-icon" />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search by name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>College</th>
                    <th>Domain</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={String(s._id)} className={editingId === String(s._id) ? "editing" : ""}>
                      <td className="name">{s.name}</td>
                      <td>{s.email}</td>
                      {/* Uses Mongoose populate to show the actual college name */}
                      <td className="code">{s.tenantId?.name || "Unassigned"}</td>
                      <td><span className="badge badge-domain">{s.domain}</span></td>
                      <td>
                        <div className="act-cell">
                          <button onClick={() => handleEditClick(s)} className="act-btn act-edit">
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => handleDelete(String(s._id))} className="act-btn act-del">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty">
                          <GraduationCap size={40} className="empty-icon" />
                          <p className="empty-text">No students found</p>
                          <p className="empty-sub">Adjust your search or enroll a new student above.</p>
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