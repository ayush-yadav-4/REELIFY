import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

type RouteContext = {
  params: Promise<{ videoId: string }>;
};

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { videoId } = await context.params;
    const video = await Video.findById(videoId);
    
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Add like if not already liked
    if (!video.likes.includes(session.user.id)) {
      video.likes.push(session.user.id);
      await video.save();
    }

    return NextResponse.json({ likes: video.likes });
  } catch (error) {
    console.error("Error liking video:", error);
    return NextResponse.json(
      { error: "Failed to like video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { videoId } = await context.params;
    const video = await Video.findById(videoId);
    
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Remove like if already liked
    video.likes = video.likes.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== session.user.id
    );
    await video.save();

    return NextResponse.json({ likes: video.likes });
  } catch (error) {
    console.error("Error unliking video:", error);
    return NextResponse.json(
      { error: "Failed to unlike video" },
      { status: 500 }
    );
  }
} 