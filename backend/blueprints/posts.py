# blueprints/posts.py

from flask import Blueprint, request, jsonify, abort
from app import db, redis_client
from models import Post
import json

# Create a Blueprint instance
posts_bp = Blueprint('posts', __name__)

@posts_bp.route('/posts', methods=['GET', 'POST'])
def posts_list():
    # Your existing posts_list function
    # ...
    """
    API endpoint for managing posts.
    ---
    tags:
      - Posts
    get:
      summary: Get all posts
      description: Retrieves a list of all blog posts, sorted by creation date.
      responses:
        200:
          description: A list of posts.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    title:
                      type: string
                      example: My First Blog Post
                    content:
                      type: string
                      example: This is the content of my first post.
                    created_at:
                      type: string
                      format: date-time
                      example: '2023-10-27T10:00:00Z'
    post:
      summary: Create a new post
      description: Creates a new post with a title and content.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                  example: My Second Blog Post
                content:
                  type: string
                  example: The content for my second post.
              required:
                - title
                - content
      responses:
        201:
          description: Post created successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Post created successfully!
        400:
          description: Bad request.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Title and content are required.
    """
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'title' not in data or 'content' not in data:
            abort(400, description='Title and content are required.')
        
        new_post = Post(title=data['title'], content=data['content'])
        db.session.add(new_post)
        db.session.commit()
        
        redis_client.delete('all_posts')
        
        return jsonify({'message': 'Post created successfully!', 'post_id': new_post.id}), 201

    if request.method == 'GET':
        query = request.args.get('q')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        posts_query = Post.query.order_by(Post.created_at.desc())
        
        if query:
            posts_query = posts_query.filter(
                (Post.title.ilike(f'%{query}%')) | (Post.content.ilike(f'%{query}%'))
            )
        
        paginated_posts = posts_query.paginate(page=page, per_page=per_page, error_out=False)
        
        posts_list = []
        for post in paginated_posts.items:
            posts_list.append({
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'created_at': post.created_at.isoformat()
            })
        
        response = {
            'posts': posts_list,
            'total_posts': paginated_posts.total,
            'total_pages': paginated_posts.pages,
            'current_page': paginated_posts.page,
            'has_next': paginated_posts.has_next,
            'has_prev': paginated_posts.has_prev
        }
        
        return jsonify(response)

@posts_bp.route('/posts/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
def post_detail(post_id):
    # Your existing post_detail function
    # ...
    post = db.get_or_404(Post, post_id)

    if request.method == 'GET':
        return jsonify({
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'created_at': post.created_at.isoformat()
        })
    
    if request.method == 'PUT':
        data = request.get_json()
        if not data or 'title' not in data or 'content' not in data:
            abort(400, description='Title and content are required.')
        
        post.title = data['title']
        post.content = data['content']
        db.session.commit()
        
        redis_client.delete('all_posts')
        
        return jsonify({'message': 'Post updated successfully!'})
        
    if request.method == 'DELETE':
        db.session.delete(post)
        db.session.commit()
        
        redis_client.delete('all_posts')
        
        return jsonify({'message': 'Post deleted successfully!'})