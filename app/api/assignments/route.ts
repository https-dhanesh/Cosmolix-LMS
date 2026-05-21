import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = sessionClaims?.metadata?.role;

    if (role !== 'cosmolix_admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, domain, dueDate } = body;

    if (!title || !domain || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // 1. Find the Mongo User so we have their _id
    const mongoUser = await User.findOne({ clerkId: userId });
    
    if (!mongoUser) {
      return NextResponse.json({ error: "Admin user not found in database" }, { status: 404 });
    }

    // 2. Pass mongoUser._id to 'createdBy'
    const newAssignment = await Assignment.create({
      title,
      description,
      domain,
      dueDate: new Date(dueDate),
      createdBy: mongoUser._id, // THIS IS THE FIX
      isActive: true
    });

    return NextResponse.json(newAssignment, { status: 201 });

  } catch (error) {
    console.error("Assignment Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}