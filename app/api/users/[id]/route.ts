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
    await connectDB();

    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Update the database record
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

    // Crucial Step: Sync updated permissions back to Clerk
    if (updatedUser.clerkId) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(updatedUser.clerkId, {
        publicMetadata: {
          role: updatedUser.role,
          tenantId: updatedUser.tenantId
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
    
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // Soft delete implementation
    const deletedUser = await User.findByIdAndUpdate(id, { isDeleted: true });

    if (!deletedUser) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    return new NextResponse("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}