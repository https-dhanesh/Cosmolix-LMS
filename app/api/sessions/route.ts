import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = sessionClaims?.metadata?.role;

    if (!userId || role !== 'cosmolix_admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const mongoUser = await User.findOne({ clerkId: userId });
    if (!mongoUser) {
      return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
    }

    const body = await req.json();
    const { tenantId, domain, topic, description, scheduledAt, meetLink } = body;

    if (!domain || !topic || !scheduledAt || !meetLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const domainValue = domain === "GLOBAL_COMMON" ? null : domain;

    const localizedDate = scheduledAt.includes("Z") || scheduledAt.includes("+") 
      ? new Date(scheduledAt) 
      : new Date(`${scheduledAt}:00+05:30`);

    const newSession = await Session.create({
      tenantId: tenantId || null, 
      domain: domainValue,
      title: topic, 
      description,
      scheduledAt: localizedDate,
      meetLink,
      createdBy: mongoUser._id,
      status: 'scheduled'
    });

    revalidatePath("/admin/sessions");
    revalidatePath("/admin");
    revalidatePath("/student");

    return NextResponse.json(JSON.parse(JSON.stringify(newSession)), { status: 201 });

  } catch (error: any) {
    console.error("Session Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');
    const tenantId = searchParams.get('tenantId'); 
    
    let query: any = {};

    if (domain) {
      query.domain = domain === "GLOBAL_COMMON" ? null : { $in: [domain, null] };
    }
    
    if (tenantId) {
      query.tenantId = { $in: [tenantId, null] };
    }

    const sessions = await Session.find(query).sort({ scheduledAt: -1 }).lean();
    
    return NextResponse.json(JSON.parse(JSON.stringify(sessions)));
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}