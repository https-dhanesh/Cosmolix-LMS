import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

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

    const mongoUser = await User.findOne({ clerkId: userId });
    
    if (!mongoUser) {
      return NextResponse.json({ error: "Admin user not found in database" }, { status: 404 });
    }

    const domainValue = domain === "GLOBAL_COMMON" ? null : domain;

    const newAssignment = await Assignment.create({
      title,
      description,
      domain: domainValue, 
      dueDate: new Date(dueDate),
      createdBy: mongoUser._id, 
      isActive: true
    });

    revalidatePath("/admin/assignments");
    revalidatePath("/student");

    return NextResponse.json(JSON.parse(JSON.stringify(newAssignment)), { status: 201 });

  } catch (error) {
    console.error("Assignment Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}