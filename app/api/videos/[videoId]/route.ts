import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";

type RouteContext = {
  params: {
    videoId: string;
  };
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectToDatabase();
    const video = await Video.findById(context.params.videoId)
      .populate('userId', 'name email')
      .lean();

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
} 