import { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaBookmark } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { IVideo } from '@/models/Video';
import mongoose from 'mongoose';

interface IComment {
  _id: mongoose.Types.ObjectId;
  userId: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
  content: string;
  createdAt: Date;
}

export type VideoCardProps = Omit<IVideo, 'userId' | 'comments'> & {
  userId: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
  comments: IComment[];
};

export default function VideoCard({ _id, title, videoUrl, userId, likes: initialLikes, comments: initialComments }: VideoCardProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (session?.user?.id) {
      setIsLiked(likes.some(id => id.toString() === session.user.id));
    }
  }, [session, likes]);

  const handleLike = async () => {
    if (!session?.user) {
      toast.error('Please login to like videos');
      return;
    }

    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/videos/${_id}/like`, {
        method,
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to update like');

      if (isLiked) {
        setLikes(likes.filter(id => id.toString() !== session.user.id));
      } else {
        setLikes([...likes, new mongoose.Types.ObjectId(String(session.user.id))]);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update like');
    }
  };

  const handleComment = async () => {
    if (!session?.user) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const response = await fetch(`/api/videos/${_id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const data = await response.json();
      setComments([...comments, data.comment]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="relative bg-black rounded-xl overflow-hidden">
      {/* Video Player */}
      <div className="relative w-full pt-[177.78%]">
        <video
          className="absolute top-0 left-0 w-full h-full object-contain bg-black"
          src={videoUrl.startsWith('http') ? videoUrl : `https://ik.imagekit.io/linxq9h5o/${videoUrl}`}
          poster={videoUrl.startsWith('http') ? videoUrl.replace(/\.[^/.]+$/, "_thumbnail.jpg") : `https://ik.imagekit.io/linxq9h5o/${videoUrl.replace(/\.[^/.]+$/, "_thumbnail.jpg")}`}
          loop
          playsInline
          controls
          onError={(e) => {
            console.error('Video loading error:', e);
            console.log('Attempted video URL:', videoUrl.startsWith('http') ? videoUrl : `https://ik.imagekit.io/linxq9h5o/${videoUrl}`);
            toast.error('Failed to load video. Please try again later.');
          }}
        />
      </div>

      {/* Interaction Buttons - Right Side */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-4">
        <button onClick={handleLike} className="group">
          <div className="p-3 rounded-full bg-gray-800/80 transition-transform group-hover:scale-110">
            {isLiked ? (
              <FaHeart className="w-6 h-6 text-rose-500" />
            ) : (
              <FaHeart className="w-6 h-6 text-white" />
            )}
          </div>
          <span className="text-white text-xs mt-1 block text-center">{likes.length}</span>
        </button>

        <button onClick={() => setShowComments(!showComments)} className="group">
          <div className="p-3 rounded-full bg-gray-800/80 transition-transform group-hover:scale-110">
            <FaComment className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs mt-1 block text-center">{comments.length}</span>
        </button>

        <button className="group">
          <div className="p-3 rounded-full bg-gray-800/80 transition-transform group-hover:scale-110">
            <FaShare className="w-6 h-6 text-white" />
          </div>
        </button>

        <button className="group">
          <div className="p-3 rounded-full bg-gray-800/80 transition-transform group-hover:scale-110">
            <FaBookmark className="w-6 h-6 text-white" />
          </div>
        </button>
      </div>

      {/* Video Info Overlay - Bottom */}
      <div className="absolute bottom-0 left-0 right-16 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
            {userId?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{userId?.name || 'Anonymous'}</h3>
            <p className="text-gray-300 text-sm truncate">{title}</p>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowComments(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Comments</h3>
              <button onClick={() => setShowComments(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4 mb-4">
              {comments.map((comment) => (
                <div key={comment._id.toString()} className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {comment.userId?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-semibold">{comment.userId?.name || 'Anonymous'}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={handleComment}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-rose-400 text-white rounded-lg hover:opacity-90"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 