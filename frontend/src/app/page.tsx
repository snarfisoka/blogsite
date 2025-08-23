import Link from "next/link";
import PostCard from "@/components/posts/PostCard";
import { getPosts } from "@/lib/api";
import Pagination from "@/components/common/Pagination";
import Search from "@/components/common/Search";

export default async function Home({ 
  searchParams, 
}: {
  searchParams: { page?: string, q?: string };
}) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const query = searchParams.q;

  const { posts, total_pages, current_page } = await getPosts(currentPage, query);

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Blog Posts</h1>
        <Link href="/posts/new" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
          Create New Post
        </Link>
      </div>
      <div className="mb-6">
        <Search />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination currentPage={current_page} totalPages={total_pages} />
    </main>
  );
}