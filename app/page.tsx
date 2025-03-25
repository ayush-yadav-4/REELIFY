"use client";

import React, { useEffect, useState } from "react";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import VideoFeed from "./components/VideoFeed";
import { FaFire } from "react-icons/fa";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main className="">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <FaFire className="text-3xl text-orange-500" />
          <h1 className="text-4xl font-bold text-white text-center">
            Trending Reels
          </h1>
        </div>
        <VideoFeed videos={videos} />
      </div>
    </main>
  );
}