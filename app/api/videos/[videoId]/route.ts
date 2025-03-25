import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    await connectToDatabase();
    const video = await Video.findById(params.videoId)
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