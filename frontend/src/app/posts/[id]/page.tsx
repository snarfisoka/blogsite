// src/app/posts/[id]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostById } from "@/lib/api";
import CommentSection from "./CommentSection";
import DeleteButton from "./DeleteButton";

export default async function PostPage({ params }: { params: Promise<{ id: string}> }) {
  const {id} = await params;
  const post = await getPostById(id);

    if (!post) {
      notFound();
    }
    
  return (
    <main className="container mx-auto p-4">
      {/* Post content (remains a server component) */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-600 text-sm mb-6">Published on: {new Date(post.created_at).toLocaleDateString()}</p>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
        <div className="mt-8 flex gap-4">
          <Link href={`/posts/${post.id}/edit`} className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
            Edit Post
          </Link>
            <DeleteButton postId={post.id} />
          <Link href="/" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors">
            Back to Posts
          </Link>
        </div>
      </div>
      
      {/* The comments section is a separate client component */}
      <CommentSection />
    </main>
  );
}