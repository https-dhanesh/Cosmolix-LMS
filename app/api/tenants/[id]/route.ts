import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import Tenant from '@/models/Tenant';

// UPDATE COLLEGE
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

    const { id } = await params;

    const updatedTenant = await Tenant.findByIdAndUpdate(
      id,
      { 
        name: body.name, 
        code: body.code.toUpperCase(), 
        contactEmail: body.contactEmail 
      },
      { new: true }
    );

    if (!updatedTenant) {
      return new NextResponse("College Not Found", { status: 404 });
    }

    return NextResponse.json(updatedTenant);
  } catch (error) {
    console.error("EDIT COLLEGE ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE COLLEGE (Soft Delete)
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
    
    // We soft delete to avoid breaking historical records 
    // for students enrolled in this college
    const deletedTenant = await Tenant.findByIdAndUpdate(id, { 
      isDeleted: true,
      isActive: false
    });

    if (!deletedTenant) {
      return new NextResponse("College Not Found", { status: 404 });
    }

    return new NextResponse("College successfully deactivated", { status: 200 });
  } catch (error) {
    console.error("DELETE COLLEGE ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}