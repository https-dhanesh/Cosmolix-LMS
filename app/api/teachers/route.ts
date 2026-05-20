import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Tenant from '@/models/Tenant';

// GET ALL TEACHERS (Populated with College Data)
export async function GET() {
  try {
    const { sessionClaims } = await auth();
    // Only Admin can see the full list of proctors
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectDB();
    
    const teachers = await User.find({ isDeleted: false, role: 'teacher' })
      .populate({ path: 'tenantId', select: 'name code', model: Tenant })
      .sort({ createdAt: -1 });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("[GET_TEACHERS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// ENROLL NEW TEACHER (Clerk + MongoDB Transactional)
export async function POST(req: Request) {
  let clerkUserId: string | null = null;
  const client = await clerkClient();

  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, email, tenantId } = body;

    if (!name || !email || !tenantId) {
      return new NextResponse("Missing name, email, or tenantId", { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse("Email already registered", { status: 400 });
    }

    // 1. Create User in Clerk
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    try {
      const clerkUser = await client.users.createUser({
        emailAddress: [email],
        firstName,
        lastName,
        password: "CosmolixFaculty2026!", // Default password
        publicMetadata: {
          role: 'teacher',
          tenantId: tenantId
        }
      });
      clerkUserId = clerkUser.id;
    } catch (clerkErr: any) {
      return new NextResponse(clerkErr.errors?.[0]?.message || "Clerk Error", { status: 400 });
    }

    // 2. Create User in MongoDB
    try {
      const newTeacher = await User.create({
        clerkId: clerkUserId,
        name,
        email,
        role: 'teacher',
        tenantId,
        isActive: true
      });

      return NextResponse.json({ message: "Success", user: newTeacher });
    } catch (mongoErr) {
      // ROLLBACK: Delete from Clerk if DB save fails
      if (clerkUserId) await client.users.deleteUser(clerkUserId);
      throw mongoErr;
    }
    
  } catch (error: any) {
    console.error("[TEACHER_ENROLL_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}