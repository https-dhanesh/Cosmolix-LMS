"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  School, 
  Users, 
  Video,
  FileText,
  CheckCircle,
  ClipboardCheck,
  Settings
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-white flex flex-col sticky top-0 h-screen shrink-0">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image 
                src="/logo.jpg" 
                alt="Cosmolix Logo" 
                fill 
                className="object-contain rounded-md" 
              />
            </div>
            <span className="text-xl font-black tracking-tight text-[#0F172A]">
              COSMOLIX <span className="text-blue-600 font-bold">LMS</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main Stats Link */}
          <SidebarLink 
            href="/admin" 
            icon={<LayoutDashboard size={20} />} 
            label="Master Overview" 
            active={pathname === "/admin"}
          />
          <SidebarLink 
            href="/admin/colleges" 
            icon={<School size={20} />} 
            label="Manage Colleges" 
            active={pathname === "/admin/colleges"}
          />

          {/* User Management Section */}
          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Enrollment & Users
          </div>
          <SidebarLink 
            href="/admin/students" 
            icon={<Users size={20} />} 
            label="Student Records" 
            active={pathname === "/admin/students"}
          />
          <SidebarLink 
            href="/admin/teachers" 
            icon={<Users size={20} />} 
            label="College Proctors" 
            active={pathname === "/admin/teachers"}
          />

          {/* Academic Operations Section */}
          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Internship Ops
          </div>
          <SidebarLink 
            href="/admin/sessions" 
            icon={<Video size={20} />} 
            label="Live Sessions" 
            active={pathname === "/admin/sessions"}
          />

          <SidebarLink 
            href="/admin/lectures" 
            icon={<Video size={20} />} 
            label="Recorded Lectures" 
            active={pathname === "/admin/lectures"}
          />
          
          <SidebarLink 
            href="/admin/assignments" 
            icon={<FileText size={20} />} 
            label="Assignments" 
            active={pathname === "/admin/assignments"}
          />
          <SidebarLink 
            href="/admin/attendance" 
            icon={<CheckCircle size={20} />} 
            label="Attendance Logs" 
            active={pathname === "/admin/attendance"}
          />
          <SidebarLink 
            href="/admin/grading" 
            icon={<ClipboardCheck size={20} />} 
            label="Grading Inbox" 
            active={pathname === "/admin/grading"}
          />
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-blue-100">
            <UserButton 
              showName 
              appearance={{
                elements: {
                  userButtonBox: "flex-row-reverse",
                  userButtonOuterIdentifier: "text-slate-900 font-bold text-sm tracking-tight"
                }
              }} 
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function SidebarLink({ href, icon, label, active }: SidebarLinkProps) {
  return (
    <Link 
      href={href} 
      className={`
        flex items-center gap-3 px-4 py-3 font-medium rounded-2xl transition-all duration-200 group
        ${active 
          ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }
      `}
    >
      <span className={`
        transition-colors duration-200
        ${active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}
      `}>
        {icon}
      </span>
      <span className="text-sm tracking-tight">{label}</span>
      
      {/* Active Indicator Dot */}
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
      )}
    </Link>
  );
}