import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Tenant from '@/models/Tenant';

// GET ALL TEACHERS
export async function GET() {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectDB();
    
    // Strictly fetch only teachers
    const teachers = await User.find({ isDeleted: false, role: 'teacher' })
      .populate({ path: 'tenantId', select: 'name code', model: Tenant })
      .sort({ createdAt: -1 });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("[GET_TEACHERS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// ENROLL NEW TEACHER
export async function POST(req: Request) {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, email, tenantId } = body; // Notice: No 'domain' or 'role' extracted, keeping it strict

    if (!name || !email || !tenantId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectDB();

    const existingDbUser = await User.findOne({ email });
    if (existingDbUser) {
      return new NextResponse("User email already exists in database.", { status: 400 });
    }

    // CLERK INTEGRATION
    const client = await clerkClient();
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    let clerkUser;
    try {
      clerkUser = await client.users.createUser({
        emailAddress: [email],
        firstName: firstName,
        lastName: lastName,
        password: "CosmolixFaculty2026!", // Distinct default password for faculty
        publicMetadata: {
          role: 'teacher', // Hardcoded safely server-side
          tenantId: tenantId
        }
      });
    } catch (clerkErr: any) {
      console.error("Clerk Creation Error:", clerkErr);
      return new NextResponse(clerkErr.errors?.[0]?.message || "Failed to create user in Clerk", { status: 400 });
    }

    // MONGODB INTEGRATION
    const newTeacher = await User.create({
      clerkId: clerkUser.id,
      name: name,
      email: email,
      role: 'teacher', // Hardcoded safely server-side
      tenantId: tenantId
    });

    return NextResponse.json({ message: "Teacher enrolled successfully", user: newTeacher });
    
  } catch (error: any) {
    console.error("[TEACHER_ENROLL_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}