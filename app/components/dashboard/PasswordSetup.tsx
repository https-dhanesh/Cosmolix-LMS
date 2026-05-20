"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { KeyRound, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function PasswordSetup() {
  const { user, isLoaded } = useUser();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isLoaded || !user) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await user.updatePassword({
        currentPassword: process.env.NEXT_DEFAULT_ONBOARDING_PASSWORD,
        newPassword: newPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.errors?.[0]?.message || "Failed to establish personalized password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-[1.5rem] p-6 flex items-center gap-4 text-emerald-800 max-w-xl">
        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
        <div>
          <h4 className="font-bold">Password Updated!</h4>
          <p className="text-xs text-emerald-700 mt-0.5">Your personalized credentials are locked in. Use your email and this new password for all future logins.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <KeyRound size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Update Account Password</h3>
          <p className="text-xs text-slate-400">Your account currently has a temporary tracking key. Change it below to protect your profile.</p>
        </div>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-4">
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5">Choose New Password</label>
          <input
            required
            type="password"
            placeholder="Minimum 8 characters..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 px-4 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading || newPassword.length < 8}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : null}
          Update Password Credentials
        </button>
      </form>
    </div>
  );
}