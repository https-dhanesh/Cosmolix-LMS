import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { id } = await params;

    await connectDB();

    // Update MongoDB: Note we strictly update only name and tenantId
    const updatedTeacher = await User.findByIdAndUpdate(
      id,
      { 
        name: body.name, 
        tenantId: body.tenantId
      },
      { new: true }
    );

    if (!updatedTeacher) {
      return new NextResponse("Teacher Not Found", { status: 404 });
    }

    // Sync changes to Clerk Metadata
    if (updatedTeacher.clerkId) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(updatedTeacher.clerkId, {
        publicMetadata: {
          role: 'teacher',
          tenantId: updatedTeacher.tenantId
        }
      });
    }

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error("EDIT TEACHER ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE TEACHER (Soft Delete)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    
    // We use isDeleted: true so historical data (sessions they proctored) remains intact
    const deletedTeacher = await User.findByIdAndUpdate(id, { 
      isDeleted: true,
      isActive: false 
    });

    if (!deletedTeacher) {
      return new NextResponse("Teacher Not Found", { status: 404 });
    }

    return new NextResponse("Teacher successfully deactivated", { status: 200 });
  } catch (error) {
    console.error("DELETE TEACHER ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}