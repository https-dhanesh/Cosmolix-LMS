import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import Session from "@/models/Session";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || "0.0.0.0";

    await connectDB();

    const student = await User.findOne({ clerkId: userId });
    const session = await Session.findById(sessionId);

    if (!student || !session) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 404 });
    }

    if (session.status === 'completed') {
      return NextResponse.json({ error: "Session has ended" }, { status: 400 });
    }

    const now = new Date();
    const sessionTime = new Date(session.scheduledAt);
    const diff = (sessionTime.getTime() - now.getTime()) / 60000;

    if (diff > 10 && session.status !== 'live') {
      return NextResponse.json({ error: "Too early to join" }, { status: 400 });
    }

    // CHECK IF ALREADY LOGGED: Clean re-entry loop optimization
    const existingAttendance = await Attendance.findOne({
      sessionId,
      studentId: student._id
    });

    if (existingAttendance) {
      return NextResponse.json({ 
        success: true, 
        message: "Already checked in, re-joining link.", 
        meetLink: session.meetLink 
      });
    }

    // Create a new fresh attendance record
    await Attendance.create({
      sessionId,
      studentId: student._id,
      tenantId: student.tenantId,
      ipAddress: ip,
      checkedInTime: now
    });

    return NextResponse.json({ success: true, meetLink: session.meetLink }, { status: 201 });

  } catch (error: any) {
    console.error("Attendance Checkin API Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}