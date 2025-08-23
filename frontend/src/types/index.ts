export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export interface Comment {
    id: number;
    text: string;
    created_at: string;
    rating?: number | null;
}

export interface PaginationData {
  posts: Post[];
  total_posts: number;
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_prev: boolean;
}