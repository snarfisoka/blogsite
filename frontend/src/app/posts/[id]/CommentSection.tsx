// src/app/posts/[id]/CommentSection.tsx

'use client';

import { useComments } from "@/hooks/useComments";
import { useParams } from "next/navigation";

export default function CommentSection() {
    const { id } = useParams<{ id: string }>();
    const postId = id ? Number(id) : null;
    const { comments, loading, newComment, setNewComment, handleCommentSubmit, handleRateComment } = useComments(postId);

    return (
        <div className="bg-white p-8 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="text-gray-500 w-full px-4 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Write a comment..."
                required
              />
              <button
                type="submit"
                className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Submit Comment
              </button>
            </form>

            {/* List of comments */}
            {loading ? (
                <p className="text-center text-gray-500">Loading comments...</p>
            ) : comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className="border-t pt-4 mt-4">
                        <p className="text-gray-700">{comment.text}</p>
                        <p className="text-gray-500 text-sm mt-1">
                            Commented on {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                        {/* Rating buttons */}
                        <div className="flex items-center mt-2">
                            <span className="text-gray-600 text-sm mr-2">Rate this comment:</span>
                            {[1, 2, 3, 4, 5].map((ratingValue) => (
                                <button
                                    key={ratingValue}
                                    onClick={() => handleRateComment(comment.id, ratingValue)}
                                    className={`text-xl mx-1 transition-colors ${comment.rating === ratingValue ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
        </div>
    );
}