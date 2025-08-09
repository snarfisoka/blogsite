'use client';

import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface Comment {
  id: number;
  text: string;
  created_at: string;
  rating?: number | null;
}


export default function PostPage() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    
    useEffect(() => {
      if (!id) return;
      
        const fetchPostAndComments = async () => {
          try {
            const postRes = await fetch(`${API_URL}/posts/${id}`, {
              cache: 'no-store',
            });
            if (!postRes.ok) notFound();
            const postData: Post = await postRes.json();
            setPost(postData);

            const commentsRes = await fetch(`${API_URL}/posts/${id}/comments`, {cache:'no-store'});
            const commentsData: Comment[] = await commentsRes.json();
            setComments(commentsData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchPostAndComments();
    }, [id, API_URL]);

   const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      try {
        const res = await fetch(`${API_URL}/posts/${post!.id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          router.push('/'); // Navigate to the home page after deletion
        } else {
          const errorData = await res.json();
          alert(`Failed to delete post: ${errorData.error}`);
        }
      } catch (error) {
        alert('An error occurred. Please try again.');
        console.error('Error deleting post:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${API_URL}/posts/${post!.id}/comments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ text: newComment }),
      });

      if (res.ok) {
        const newCommentData = await res.json();
        setComments([{ id: newCommentData.comment_id, text: newComment, created_at: new Date().toISOString() }, ...comments]);
        setNewComment('');
      } else {
        alert(`Failed to add comment: ${(await res.json()).error}`);
      }
    } catch (error) {
      alert('An error occurred while adding the comment.');
      console.error('Error adding comment', error);
    }
  };

  const handleRateComment = async (commentId: number, rating: number) => {
    try {
      const res = await fetch(`${API_URL}/comments/${commentId}/rate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (res.ok) {
        alert('Rating submitted successfully!');
        setComments(comments.map(c => c.id === commentId ? { ...c, rating: rating } : c));
      } else {
        alert(`Failed to rate comment: ${(await res.json()).error}`)
      }
    } catch (error) {
      alert('An error occurred while rating the comment.');
      console.error('Error rating comment:', error);
    }
  };

  if (!post) {
    return <main className="container mx-auto p-4">Loading...</main>
  }

  return (
    <main className="container mx-auto p-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-600 text-sm mb-6">Published on: {new Date(post.created_at).toLocaleDateString()}</p>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
        <div className="mt-8 flex gap-4">
          <Link href={`/posts/${post.id}/edit`} className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
            Edit Post
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Post'}
          </button>
          <Link href="/" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors">
            Back to Posts
          </Link>
        </div>
      </div>

      {/* Comment section */}
      <div className="bg-white p-8 rounded-lg shadow-md">
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
        {comments.length > 0 ? (
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
    </main>
  );
}