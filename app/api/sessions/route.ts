import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User";

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
    
    // MAPPING: We take 'topic' from the form and save it as 'title' for the Model
    const { tenantId, domain, topic, description, scheduledAt, meetLink } = body;

    if (!domain || !topic || !scheduledAt || !meetLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newSession = await Session.create({
      tenantId: tenantId || null, // Optional: if null, it's a global session
      domain,
      title: topic, // Handshake with the form 'topic' field
      description,
      scheduledAt: new Date(scheduledAt),
      meetLink,
      createdBy: mongoUser._id,
      status: 'scheduled'
    });

    return NextResponse.json(newSession, { status: 201 });

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
    if (domain) query.domain = domain;
    if (tenantId) query.tenantId = tenantId;

    const sessions = await Session.find(query).sort({ scheduledAt: -1 });
    
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}