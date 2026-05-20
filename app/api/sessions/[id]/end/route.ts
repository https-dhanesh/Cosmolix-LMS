import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== "cosmolix_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const updatedSession = await Session.findByIdAndUpdate(
      id,
      { status: "completed" },
      { returnDocument: "after" }
    );

    return NextResponse.json(updatedSession);
  } catch (error) {
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 });
  }
}