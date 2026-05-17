import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, School, Users, Activity, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image src="/logo.jpg" alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#0F172A]">
              COSMOLIX <span className="text-blue-600 font-bold">LMS</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink href="/admin" icon={<LayoutDashboard size={20} />} label="Master Overview" />
          <SidebarLink href="/admin/colleges" icon={<School size={20} />} label="Manage Colleges" />
          <SidebarLink href="/admin/students" icon={<Users size={20} />} label="Students" />
          <SidebarLink href="/admin/sessions" icon={<Activity size={20} />} label="Live Sessions" />
        </nav>

        <div className="p-4 border-t bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <UserButton showName appearance={{
              elements: {
                userButtonBox: "flex-row-reverse",
                userButtonOuterIdentifier: "text-slate-900 font-semibold text-sm"
              }
            }} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-100 hover:text-blue-600 transition-all group"
    >
      <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
        {icon}
      </span>
      {label}
    </Link>
  );
}