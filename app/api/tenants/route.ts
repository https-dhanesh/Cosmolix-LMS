import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db'; 
import Tenant from '@/models/Tenant';

// GET ALL ACTIVE COLLEGES
export async function GET() {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectDB(); 
    
    // Fetch only non-deleted colleges for the Admin table
    const tenants = await Tenant.find({ isDeleted: false }).sort({ createdAt: -1 });
    return NextResponse.json(tenants);
  } catch (error) {
    console.error("[GET_TENANTS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// CREATE NEW COLLEGE
export async function POST(req: Request) {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { name, code, contactEmail } = await req.json();
    await connectDB(); 

    const upperCode = code.toUpperCase();

    // Prevent duplicate college codes
    const existingTenant = await Tenant.findOne({ code: upperCode });
    if (existingTenant) {
      return new NextResponse("College code already exists", { status: 400 });
    }

    const tenant = await Tenant.create({
      name,
      code: upperCode,
      contactEmail,
      isActive: true,
      isDeleted: false,
      domains: [] 
    });

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("[POST_TENANT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}