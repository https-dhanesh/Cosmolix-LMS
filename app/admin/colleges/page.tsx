"use client";

import { useState, useEffect } from 'react';
import { ITenant } from '@/models/Tenant';

export default function ManageCollegesPage() {
  const [tenants, setTenants] = useState<ITenant[]>([]);
  
  // State for forms and editing
  const [formData, setFormData] = useState({ name: '', code: '', contactEmail: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTenants = async () => {
    const res = await fetch('/api/tenants');
    if (res.ok) {
      const data = await res.json();
      setTenants(data);
    }
  };

  useEffect(() => {
    const loadInitialTenants = async () => {
      const res = await fetch('/api/tenants');
      if (res.ok) {
        const data = await res.json();
        setTenants(data);
      }
    };
    loadInitialTenants();
  }, []);

  // Handles both Creation (POST) and Updating (PATCH)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingId ? `/api/tenants/${editingId}` : '/api/tenants';
    const method = editingId ? 'PATCH' : 'POST';
    
    const res = await fetch(url, {
      method,
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      setFormData({ name: '', code: '', contactEmail: '' });
      setEditingId(null);
      fetchTenants(); 
    } else {
      alert(`Error ${editingId ? 'updating' : 'creating'} college.`);
    }
  };

  // Pre-fills the form for editing
  const handleEditClick = (tenant: ITenant) => {
    setEditingId(String(tenant._id));
    setFormData({
      name: tenant.name,
      code: tenant.code,
      contactEmail: tenant.contactEmail
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', code: '', contactEmail: '' });
  };

  const handleToggle = async (id: string) => {
    const res = await fetch(`/api/tenants/${id}/toggle`, { method: 'PATCH' });
    if (res.ok) fetchTenants(); 
  };

  // Triggers Soft Delete API
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this college?")) return;
    
    const res = await fetch(`/api/tenants/${id}`, { method: 'DELETE' });
    if (res.ok) fetchTenants();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Manage Colleges</h1>
      
      {/* Registration & Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit College Details' : 'Register New College'}
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <input required placeholder="College Name" className="border p-2 rounded" 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          
          <input required placeholder="Code (e.g. MIT-01)" className="border p-2 rounded uppercase" 
            value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
          
          <input placeholder="Contact Email" type="email" className="border p-2 rounded" 
            value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
            
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            {editingId ? 'Update' : 'Create'}
          </button>

          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Code</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={String(t._id)} className="border-b">
                <td className="p-4">{t.name}</td>
                <td className="p-4">{t.code}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm ${t.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {t.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 space-x-3">
                  <button onClick={() => handleEditClick(t)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleToggle(String(t._id))} className="text-slate-600 hover:underline">
                    Toggle Status
                  </button>
                  <button onClick={() => handleDelete(String(t._id))} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            
            {tenants.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No colleges registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}