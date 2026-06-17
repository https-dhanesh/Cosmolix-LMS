import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Lecture from "@/models/Lecture";

export async function POST(req: Request) {
  try {
    const { sessionClaims } = await auth();
    const role = sessionClaims?.metadata?.role;

    if (role !== "cosmolix_admin") {
      return new NextResponse("Unauthorized. Admin access required.", { status: 403 });
    }

    await connectDB();
    const { name, youtubeUrl, domain, sessionDate } = await req.json();

    if (!name || !youtubeUrl || !domain || !sessionDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newLecture = await Lecture.create({
      name,
      youtubeUrl,
      domain,
      sessionDate: new Date(sessionDate),
    });

    return NextResponse.json(newLecture, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return new NextResponse("Domain query parameter is required", { status: 400 });
    }

    const lectures = await Lecture.find({ domain }).sort({ sessionDate: -1 });
    return NextResponse.json(lectures);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}