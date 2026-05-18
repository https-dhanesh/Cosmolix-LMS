import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    // 1. Security Check: Only Admins can enroll users globally
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, email, role, tenantId, domain } = body;

    // Basic Validation
    if (!name || !email || !role || !tenantId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectDB();

    // Check if user already exists in DB to prevent duplicates
    const existingDbUser = await User.findOne({ email });
    if (existingDbUser) {
      return new NextResponse("User email already exists in database.", { status: 400 });
    }

    // 2. CLERK INTEGRATION: Create the user in Auth system
    // We assign a default password. They can change it later using "Forgot Password" on login.
    const client = await clerkClient();
    
    // Splitting name for Clerk's first/last name fields
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    let clerkUser;
    try {
      clerkUser = await client.users.createUser({
        emailAddress: [email],
        firstName: firstName,
        lastName: lastName,
        password: "CosmolixUser2026!", // Default temporary password
        publicMetadata: {
          role: role,
          tenantId: tenantId
        }
      });
    } catch (clerkErr: any) {
      console.error("Clerk Creation Error:", clerkErr);
      return new NextResponse(clerkErr.errors?.[0]?.message || "Failed to create user in Clerk", { status: 400 });
    }

    // 3. MONGODB INTEGRATION: Save user to our database
    const newUser = await User.create({
      clerkId: clerkUser.id,
      name: name,
      email: email,
      role: role,
      tenantId: tenantId,
      domain: role === 'student' ? domain : undefined,
      enrolledAt: role === 'student' ? new Date() : undefined // Required per your architecture
    });

    return NextResponse.json({ message: "User enrolled successfully", user: newUser });
    
  } catch (error: any) {
    console.error("[ENROLL_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}