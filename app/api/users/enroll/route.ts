import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  let clerkUserId: string | null = null;
  const client = await clerkClient();

  try {
    // 1. AUTHORIZATION GATE
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, email, role, tenantId, domain } = body;

    if (!name || !email || !role || !tenantId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectDB();

    const existingDbUser = await User.findOne({ email });
    if (existingDbUser) {
      return new NextResponse("User already exists in system", { status: 400 });
    }

    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';

    // Extract your standard onboarding credentials pass phrase
    const defaultPassword = process.env.DEFAULT_ONBOARDING_PASSWORD || 'Welcome@Cosmolix2026';

    // 2. CLERK IDENTITY INITIALIZATION (Standard Password Provisioning)
    try {
      const clerkUser = await client.users.createUser({
        emailAddress: [email],
        firstName,
        lastName,
        password: defaultPassword, // Accounts are immediately standard and active
        publicMetadata: {
          role: role,
          tenantId: tenantId,
          domain: role === 'student' ? domain : undefined 
        }
      });
      clerkUserId = clerkUser.id;
    } catch (clerkErr: any) {
      console.error("Clerk SDK User Creation Failure:", clerkErr);
      return new NextResponse(clerkErr.errors?.[0]?.message || "Identity synchronization error", { status: 400 });
    }

    // 3. DATABASE RECORD CREATION
    try {
      const newUser = await User.create({
        clerkId: clerkUserId,
        name: `${firstName} ${lastName}`.trim(),
        email,
        role,
        tenantId,
        domain: role === 'student' ? domain : undefined,
        enrolledAt: role === 'student' ? new Date() : undefined,
        isActive: true,
        isDeleted: false
      });

      return NextResponse.json({ 
        message: "Enrollment successful. Account is instantly active with default credentials." 
      }, { status: 201 });

    } catch (mongoErr) {
      if (clerkUserId) {
        console.error("Database tracking fault occurred. Rolling back identity profiles.");
        await client.users.deleteUser(clerkUserId);
      }
      throw mongoErr;
    }
    
  } catch (error: any) {
    console.error("[ENROLLMENT_CRITICAL_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}