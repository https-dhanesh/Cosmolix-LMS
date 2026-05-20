import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  Users, 
  Building2, 
  UserSquare2,
  ClipboardCheck
} from "lucide-react";

export const studentNavigation = [
  { name: "Dashboard", href: "/student", icon: LayoutDashboard },
  { name: "Assignments", href: "/student/assignments", icon: BookOpen },
  { name: "My Results", href: "/student/results", icon: GraduationCap },
  { name: "Resources", href: "/student/resources", icon: BookOpen },
];

export const adminNavigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Colleges", href: "/admin/colleges", icon: Building2 },
  { name: "Manage Students", href: "/admin/students", icon: Users },
  { name: "Manage Teachers", href: "/admin/teachers", icon: UserSquare2 },
  { name: "Grading Inbox", href: "/admin/grading", icon: ClipboardCheck },
];