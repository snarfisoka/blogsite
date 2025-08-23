import Link from 'next/link';
import { Post } from '../../types'; // Import the Post type

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
      <Link href={`/posts/${post.id}`} prefetch={false}>
        <h2 className='text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors'>
          {post.title}
        </h2>
      </Link>
      <p className='text-gray-700 line-clamp-3 mb-4'>
        {post.content.substring(0, 100)}...
      </p>
      <Link href={`/posts/${post.id}`} prefetch={false} className='mt-4 inline-block text-blue-500 hover:text-blue-700 font-medium'>
        Read more &rarr;
      </Link>
    </div>
  );
};

export default PostCard;