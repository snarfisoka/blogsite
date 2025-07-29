from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identify, create_access_token
from .models import db, User, Post
from .extensions import redis_client, db
from datetime import timedelta
import json

bp = Blueprint('blog', __name__)

# Auth: supabase login token -> our JWT token
@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email required'}), 400

    # Get or create the user in DB
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email)
        db.session.add(user)
        db.session.commit()

    access_token = create_access_token(identity=email, expire_delta=timedelta(days=1))
    return jsonify(access_token=access_token)

# Get Posts (Public)
@app.route('/api/posts', methods=['GET'])
def get_posts():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 5))

    pagination = Post.query.order_by(Post.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'posts': [{
            'id': p.id,
            'title': p.title,
            'content': p.content,
            'created_at': p.created_at.isoformat(),
            'user_email': p.user_email
        } for p in pagination.items],
        'total': pagination.total,
        'page': paginate.page,
        'pages': pagination,pages,
    })


# Create Post (Protected)
@bp.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():
    data = request.get_json()
    email = get_jwt_identify()
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    post = Post(title=data['title'], content=data['content'], user_id=user.id)
    db.session.add(post)
    db.session.commit()
    redis_client.flushdb() #clear cache
    return jsonify({"message": "Post created"}), 201

# Delete Post (Author Only)
@bp.route('/api/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    email = get_jwt_identify()
    user = User.query.filter_by(email=email).first()
    post = Post.query.get_or_404(post_id)

    if post.user_id != user.id:
        return jsonify({'error': 'You are not the author'}), 403

    db.session.delete(post)
    db.session.commit()
    redis_client.flushdb()
    return jsonify({'message': 'Post deleted'}), 200