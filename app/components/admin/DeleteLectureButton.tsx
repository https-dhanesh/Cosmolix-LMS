'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteLectureButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this lecture recording?")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/lectures?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh(); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={deleting}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0 disabled:opacity-50"
      title="Delete lecture record"
    >
      {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}