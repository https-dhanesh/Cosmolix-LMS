import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Define as Promise
) {
  try {
    const { id } = await params; 

    const body = await req.json();
    const { grade, feedback } = body;

    await connectDB();

    const updatedSubmission = await Submission.findByIdAndUpdate(
      id, 
      {
        grade,
        feedback,
        status: "graded",
      },
      { 
        returnDocument: 'after' 
      }
    );

    if (!updatedSubmission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("GRADING_ERROR:", error);
    return NextResponse.json({ error: "Failed to update grade" }, { status: 500 });
  }
}