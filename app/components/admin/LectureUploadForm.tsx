'use client';

import { useState } from 'react';
import { Video, Plus, CheckCircle2 } from "lucide-react";

export default function LectureUploadForm() {
  const [formData, setFormData] = useState({ name: '', youtubeUrl: '', domain: '', sessionDate: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const res = await fetch('/api/lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus('success');
      setFormData({ name: '', youtubeUrl: '', domain: '', sessionDate: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 bg-red-50 text-red-600 rounded-xl">
          <Video size={18} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Publish Recorded Lecture</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">Link domain-specific recordings directly to student workspaces.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Session Title (e.g., Advanced GitOps Pipelines)"
            value={formData.name}
            required
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 font-light"
          />
        </div>

        <div>
          <input
            type="url"
            placeholder="YouTube Video URL"
            value={formData.youtubeUrl}
            required
            onChange={e => setFormData({...formData, youtubeUrl: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 font-light"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.domain}
            required
            onChange={e => setFormData({...formData, domain: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 font-light text-slate-600 bg-white"
          >
            <option value="">Select Domain</option>
            <option value="Full-Stack">Full-Stack</option>
            <option value="DevOps">DevOps</option>
            <option value="Cloud">Cloud</option>
          </select>

          <input
            type="date"
            value={formData.sessionDate}
            required
            onChange={e => setFormData({...formData, sessionDate: e.target.value})}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 font-light text-slate-600"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {status === 'loading' ? (
            'Publishing...'
          ) : status === 'success' ? (
            <>
              <CheckCircle2 size={16} className="text-emerald-400" />
              Published Successfully
            </>
          ) : (
            <>
              <Plus size={16} />
              Publish Session
            </>
          )}
        </button>
        {status === 'error' && (
          <p className="text-xs text-red-500 mt-1 text-center">Failed to publish recording. Please check fields.</p>
        )}
      </form>
    </div>
  );
}