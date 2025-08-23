# blueprints/comments.py

from flask import Blueprint, request, jsonify, abort
from app import db
from models import Post, Comment
from datetime import datetime, UTC

# Create a Blueprint instance
comments_bp = Blueprint('comments', __name__)

@comments_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
def add_comment(post_id):
    post = db.get_or_404(Post, post_id)
    data = request.get_json()

    if not data or 'text' not in data:
        abort(400, description='Comment text is required.')

    new_comment = Comment(text=data['text'], post_id=post.id, created_at=datetime.now(UTC))
    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify({'message': 'Comment added successfully!', 'comment_id': new_comment.id}), 201

@comments_bp.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    post = db.get_or_404(Post, post_id)
    comments = Comment.query.filter_by(post_id=post.id).order_by(Comment.created_at.desc()).all()

    return jsonify([
        {
            'id': comment.id,
            'text': comment.text,
            'created_at': comment.created_at.isoformat(),
            'rating': comment.rating
        } for comment in comments
    ])

@comments_bp.route('/comments/<int:comment_id>/rate', methods=['PUT'])
def rate_comment(comment_id):
    comment = db.get_or_404(Comment, comment_id)
    data = request.get_json()

    if 'rating' not in data or not isinstance(data['rating'], int):
        abort(400, description='A valid rating (integer) is required.')

    if data['rating'] < 1 or data['rating'] > 5:
        abort(400, description='Rating must be between 1 and 5.')

    comment.rating = data['rating']
    db.session.commit()

    return jsonify({'message': 'Comment rated successfully!'})