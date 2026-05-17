import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ArrowRight, ShieldCheck, Zap, LayoutDashboard, Globe, Award } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Navigation - Dark Theme to match Logo Slate */}
      <header className="px-6 py-4 flex justify-between items-center bg-[#0F172A] border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image src="/logo.jpg" alt="Cosmolix Logo" fill className="object-contain rounded-md" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            COSMOLIX <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">LMS</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {!userId ? (
            <>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">
                  Get Started
                </button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border border-slate-700",
                  },
                }}
              />
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 overflow-hidden bg-[#0F172A]">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-[120px]" />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Zap className="w-4 h-4 fill-blue-400" />
              Next-Gen Industrial Training
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
              Master the Future of <br />
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Industrial Talent.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The premium multi-tenant ecosystem for institutions to bridge the gap
              between academic theory and industrial excellence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!userId ? (
                <SignUpButton mode="modal">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl hover:-translate-y-1">
                  Start your journey
                </button>
              </SignUpButton>
              ) : (
                <Link
                  href="/admin"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl hover:-translate-y-1"
                >
                  Enter Workspace <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10 text-blue-500" />}
              title="Role-Aware Isolation"
              desc="Bank-grade tenant security ensures every college's data remains strictly private and isolated."
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10 text-teal-500" />}
              title="Automated Sprints"
              desc="Real-time evaluation engines for Saturday sprints with automated feedback and leaderboard sync."
            />
            <FeatureCard
              icon={<Award className="w-10 h-10 text-emerald-500" />}
              title="Verified Certification"
              desc="Directly issue tamper-proof completion certificates recognized by our industrial partners."
            />
          </div>
        </section>
      </main>

      <footer className="py-12 bg-white border-t border-slate-200 text-center">
        <p className="text-slate-500 text-sm font-medium">
          © 2026 COSMOLIX <span className="text-blue-600">LMS</span>. Engineered for Excellence.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group">
      <div className="mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-bold text-xl mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}