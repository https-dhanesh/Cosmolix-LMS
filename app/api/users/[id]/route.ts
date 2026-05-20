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

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        name: body.name, 
        tenantId: body.tenantId, 
        domain: body.domain 
      },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    // Sync updated Metadata back to Clerk
    if (updatedUser.clerkId) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(updatedUser.clerkId, {
        publicMetadata: {
          role: updatedUser.role,
          tenantId: updatedUser.tenantId,
          domain: updatedUser.domain // ENSURING UPDATED DOMAIN REACHES CLERK
        }
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("EDIT USER ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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
    
    // Soft delete to preserve historical submission/attendance data
    const deletedUser = await User.findByIdAndUpdate(id, { 
      isDeleted: true,
      isActive: false 
    });

    if (!deletedUser) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    return new NextResponse("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}