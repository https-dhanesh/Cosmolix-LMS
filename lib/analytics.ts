import Attendance from "@/models/Attendance";
import Session from "@/models/Session";

export async function getStudentAttendance(studentId: string, domain: string, tenantId: string) {
  // 1. Count total sessions for this domain that have already finished or are live
  const totalSessions = await Session.countDocuments({
    domain: domain,
    status: { $in: ["live", "completed"] },
  });

  if (totalSessions === 0) return 0;

  // 2. Count how many of those sessions the student actually checked into
  const attendedCount = await Attendance.countDocuments({
    studentId: studentId,
    tenantId: tenantId,
  });

  const percentage = (attendedCount / totalSessions) * 100;
  return Math.round(percentage);
}