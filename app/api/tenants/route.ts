import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db'; 
import Tenant from '@/models/Tenant';

export async function GET() {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectDB(); 
    // This fetches the data for the table
    const tenants = await Tenant.find({ isDeleted: false }).sort({ createdAt: -1 });
    return NextResponse.json(tenants);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { name, code, contactEmail } = await req.json(); // Removed domains
    await connectDB(); 

    const existingTenant = await Tenant.findOne({ code: code.toUpperCase() });
    if (existingTenant) {
      return new NextResponse("College code already exists", { status: 400 });
    }

    const tenant = await Tenant.create({
      name,
      code: code.toUpperCase(),
      contactEmail,
      domains: [] // Hardcoded as empty array to respect schema requirements silently
    });

    return NextResponse.json(tenant);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}