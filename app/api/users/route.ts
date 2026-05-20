import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Tenant from '@/models/Tenant';

export async function GET(req: Request) {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'cosmolix_admin') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || 'student';

    const users = await User.find({ isDeleted: false, role: role })
      .populate({ path: 'tenantId', select: 'name code', model: Tenant })
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[GET_USERS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}