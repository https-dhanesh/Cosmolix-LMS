import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import User from "@/models/User";
import Assignment from "@/models/Assignment";

export async function GET(req: Request) {
  try {
    const { sessionClaims } = await auth();
    const tenantId = sessionClaims?.metadata?.tenantId;
    const role = sessionClaims?.metadata?.role;

    if (role !== "teacher" && role !== "cosmolix_admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const viewStatus = searchParams.get("status");

    const query: any = role === "cosmolix_admin" ? {} : { tenantId };
    if (viewStatus) {
      query.status = viewStatus;
    }

    const submissions = await Submission.find(query)
      .populate("studentId", "name email")
      .populate("assignmentId", "title")
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Submission GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { assignmentId, submissionLink } = await req.json();

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const student = await User.findOne({ clerkId: userId });
    if (!student) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

    if (new Date() > new Date(assignment.dueDate)) {
      return NextResponse.json({ error: "Deadline has passed. Edits rejected." }, { status: 400 });
    }

    const submission = await Submission.findOneAndUpdate(
      { assignmentId, studentId: student._id },
      {
        submissionLink,
        tenantId: student.tenantId,
        status: "pending",
        submittedAt: new Date()
      },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json(submission, { status: 201 });
  } catch (error: any) {
    console.error("Submission POST Error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}