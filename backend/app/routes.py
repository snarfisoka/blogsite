import json
from flask import Blueprint, request, jsonify, current_app
from .models import db, Post
from .services import get_post_from_cache, set_post_in_cache

api_bp = Blueprint('api', __name__)

#Get all posts
@api_bp.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.quer.order_by(Post.created_at.desc()).all()
    return jsonify([post.to_dict() for post in posts])

#Get a single post (with caching)
@api_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    #Try to get from cache first
    cached_post = get_post_from_cache(post_id)
    if cached_post:
        return jsonify(json.loads(cached_post))

    #If not in cache, get from DB
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    #Set in cache for future requests
    set_post_in_cache(post_id, post)
    return jsonify(post.to_dict()) 

#Create a new post
@api_bp.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    if not data or not 'title' in data or not 'content' in data:
        return jsonify({"error": "Missing title or content"}), 400

        new_post = Post(title=data['title'], content=daa['content'])
        db.session.add(new_post)
        db.session.commit()
        return jsonify(new_post.to_dict()), 201

#Update a post
@api_bp.route('/posts/<int:post_id>', methods=['PUT'])
def update_post():
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

        data = request.get_json()
        post.title = data.get('title', post.title)
        post.content = data.get('content', post.content)
        db.session.commit()

        #Update cache
        set_post_in_cache(post_id, post)
        return jsonify(post.to_dict())

# Delete a post
@api_bp.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

        db.session.delete(post)
        db.session.commit()

        #Invalidate cache
        current_app.redis_client.delete(f"post:{post_id}")
        return '', 204