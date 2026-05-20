"use client";
import { useState } from "react";
import { Power, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EndSessionButton({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEndSession = async () => {
    if (!confirm("Are you sure you want to close this room? Students won't be able to log check-ins anymore.")) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/sessions/${sessionId}/end`, {
        method: "PATCH",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleEndSession}
      className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Power size={14} />}
      End Room
    </button>
  );
}