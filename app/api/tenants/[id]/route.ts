import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import Tenant from '@/models/Tenant';

export async function PATCH(
  req: Request,
  // Type adjusted for newer Next.js versions
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    await connectDB();

    // 🚨 THE FIX: Await the params before extracting the ID
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const updatedTenant = await Tenant.findByIdAndUpdate(
      id,
      { 
        name: body.name, 
        code: body.code.toUpperCase(), 
        contactEmail: body.contactEmail 
      },
      { new: true }
    );

    // Prevent silent failures
    if (!updatedTenant) {
      return new NextResponse("Tenant Not Found", { status: 404 });
    }

    return NextResponse.json(updatedTenant);
  } catch (error) {
    console.error("EDIT ERROR:", error);
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
    
    // 🚨 THE FIX: Await the params before extracting the ID
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // Soft delete implementation
    const deletedTenant = await Tenant.findByIdAndUpdate(id, { isDeleted: true });

    // Prevent silent failures
    if (!deletedTenant) {
      return new NextResponse("Tenant Not Found", { status: 404 });
    }

    return new NextResponse("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}