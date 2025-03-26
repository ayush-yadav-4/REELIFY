"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";
import { useSession } from "next-auth/react";
import mongoose from "mongoose";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality: number;
  };
  userId: mongoose.Types.ObjectId;
  url: string;
  caption: string;
  likes: mongoose.Types.ObjectId[];
  comments: {
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
}

const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo']
};

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      controls: true,
      transformation: {
        height: VIDEO_DIMENSIONS.height,
        width: VIDEO_DIMENSIONS.width,
        quality: 100,
      },
      url: "",
      caption: "",
      likes: [],
      comments: [],
    },
  });

  const validateVideo = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!VIDEO_DIMENSIONS.allowedTypes.includes(file.type)) {
        showNotification("Please upload a valid video file (MP4, MOV, AVI)", "error");
        resolve(false);
        return;
      }

      if (file.size > VIDEO_DIMENSIONS.maxSize) {
        showNotification("Video size should be less than 50MB", "error");
        resolve(false);
        return;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const isValid = video.videoWidth === VIDEO_DIMENSIONS.width && 
                       video.videoHeight === VIDEO_DIMENSIONS.height;
        if (!isValid) {
          showNotification(`Video dimensions must be ${VIDEO_DIMENSIONS.width}x${VIDEO_DIMENSIONS.height}`, "error");
        }
        resolve(isValid);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleUploadSuccess = async (response: IKUploadResponse) => {
    try {
      setValue("videoUrl", response.filePath);
      setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
      setValue("url", response.url);
      showNotification("Video uploaded successfully!", "success");
    } catch (error) {
      console.error("Failed to process video", error);
      showNotification("Failed to process video", "error");
    }
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      showNotification("Please upload a video first", "error");
      return;
    }

    if (!session?.user?.id) {
      showNotification("Please login to upload videos", "error");
      return;
    }

    setLoading(true);
    try {
      const videoData = {
        ...data,
        userId: session.user.id as unknown as mongoose.Types.ObjectId,
        caption: data.description,
      };
      
      await apiClient.createVideo(videoData);
      showNotification("Video published successfully!", "success");

      // Reset form after successful submission
      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setValue("url", "");
      setValue("caption", "");
      setUploadProgress(0);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text text-white">Title</span>
        </label>
        <input
          type="text"
          className={`input input-bordered bg-gray-800 text-white ${
            errors.title ? "input-error" : ""
          }`}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <span className="text-error text-sm mt-1">
            {errors.title.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-white">Description</span>
        </label>
        <textarea
          className={`textarea textarea-bordered h-24 bg-gray-800 text-white ${
            errors.description ? "textarea-error" : ""
          }`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-white">Upload Video (1080x1920)</span>
        </label>
        <FileUpload
          fileType="video"
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
          onValidate={validateVideo}
        />
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-rose-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block bg-gradient-to-r from-orange-500 to-rose-500 text-white"
        disabled={loading || !uploadProgress}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Publishing Video...
          </>
        ) : (
          "Publish Video"
        )}
      </button>
    </form>
  );
}