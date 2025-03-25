import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import VideoCard, { type VideoCardProps } from './VideoCard';
import { toast } from 'react-hot-toast';
import { IVideo } from '@/models/Video';
import { FaVideo, FaUpload } from 'react-icons/fa';
import Link from 'next/link';

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Upload CTA Section */}
      <div className="mb-12 bg-gradient-to-r from-orange-50/50 to-rose-50/50 rounded-2xl p-8 shadow-lg transform hover:scale-[1.02] transition-all">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Share Your Moments</h2>
            <p className="text-gray-600">Upload your videos and inspire others</p>
          </div>
          <Link 
            href="/upload"
            className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-lg font-medium 
              hover:opacity-90 transition-all flex items-center gap-2 shadow-md hover:shadow-xl"
          >
            <FaUpload className="text-lg" />
            Upload Now
          </Link>
        </div>
      </div>

      {/* Videos Grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div 
              key={video._id?.toString()}
              className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl rounded-xl overflow-hidden"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              <VideoCard {...video as unknown as VideoCardProps} />
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-orange-50/50 to-rose-50/50 rounded-2xl p-8 shadow-lg">
          <div className="bg-white/80 p-8 rounded-full mb-6">
            <FaVideo className="w-16 h-16 text-orange-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">No Videos Yet</h2>
          <p className="text-gray-600 mb-8">Be the first to share your amazing content!</p>
          <Link 
            href="/upload"
            className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-4 rounded-lg font-medium 
              hover:opacity-90 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md"
          >
            <FaUpload className="text-lg" />
            Upload Your First Video
          </Link>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}