# backend/models.py

from app import db
from datetime import datetime, UTC

class Post(db.Model):
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))

    comments = db.relationship('Comment', backref='post', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'comments': [comment.to_dict() for comment in self.comments]
        }

class Comment(db.Model):
    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(225), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))

    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)

    rating = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'created_at': self.created_at.isoformat(),
            'post_id': self.post_id,
            'rating': self.rating
        }