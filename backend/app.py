import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import redis

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# --- Configuration ---
# This is a placeholder for your database URI.
# You'll need to replace 'your_user', 'your_password', 'your_host', 'your_port', and 'your_database'
# with your actual PostgreSQL credentials.
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Initialize Redis connection
redis_url = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
redis_client = redis.from_url(redis_url, decode_responses=True)

# --- Define Database Models ---
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    comments = db.relationship('Comment', backref='post', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Post {self.title}>'

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(225), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    rating = db.Column(db.Integer, nullable=True)
    #Define a foreign key to link a comment to a post
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)

    def __repr__(self):
        return f'<Comment {self.text[:20]}...>'


# --- API Routes ---
# GET all posts and POST a new post
@app.route('/posts', methods=['GET', 'POST'])
def posts_list():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'title' not in data or 'content' not in data:
            return jsonify({'error': 'Title and content are required.'}), 400

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
            #Search logic
            #This searches for the query string in both the title and content
            posts_query = Post.query.filter(
                (Post.title.ilike(f'%{query}%')) | (Post.content.ilike(f'%{query}%'))
            )
            print(f"Searching for: {query}...")

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
       
    
#GET, PUT, and DELETE a single post
@app.route('/posts/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
def post_detail(post_id):
    post = Post.query.get_or_404(post_id)

    if request.method == 'GET':
        return jsonify({
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'created_at': post.created_at.isoformat()
        })
    
    elif request.method == 'PUT':
        data = request.get_json()
        if not data or 'title' not in data or 'content' not in data:
            return jsonify({'error': 'Title and content are required.'}), 400
        
        post.title = data['title']
        post.content = data['content']
        db.session.commit()
        return jsonify({'message': 'Post updated successfully!'})
    
    elif request.method == 'DELETE':
        db.session.delete(post)
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully!'})
    
@app.route('/posts/<int:post_id>/comments', methods=['POST'])
def add_comment(post_id):
    post = Post.query.get_or_404(post_id)
    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({'error': 'Comment text is required.'}), 400
    
    new_comment = Comment(text=data['text'], post_id=post.id)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({'message': 'Comment added successfully!', 'comment_id': new_comment.id}), 201

@app.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    post = Post.query.get_or_404(post_id)
    comments = Comment.query.filter_by(post_id=post.id).order_by(Comment.created_at.desc()).all()

    comments_list = []
    for comment in comments:
        comments_list.append({
            'id': comment.id,
            'text': comment.text,
            'created_at': comment.created_at.isoformat(),
            'rating': comment.rating
        })

    return jsonify(comments_list)

@app.route('/comments/<int:comment_id>/rate', methods=['PUT'])
def rate_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    data = request.get_json()

    if 'rating' not in data or not isinstance(data['rating'], int):
        return jsonify({'error': 'A valid rating (integer) is required.'}), 400
    
    #Assume rating is a number from 1 to 5
    if data['rating'] < 1 or data['rating'] > 5:
        return jsonify({'error': 'Rating must be between 1 and 5.'}), 400
    
    comment.rating = data['rating']
    db.session.commit()

    return jsonify({'message': 'Comment rated successfully!'})

# Basic route to check if the app is running
@app.route('/')
def index():
    return "Welcome to the Blogsite Backend!"

if __name__ == '__main__':
    app.run(debug=True)