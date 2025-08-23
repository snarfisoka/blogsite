# app.py

import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flasgger import Swagger
import redis

# Initialize extensions outside of the factory
db = SQLAlchemy()
migrate = Migrate()
swagger = Swagger()
redis_client = redis.from_url(os.environ.get('REDIS_URL', 'redis://localhost:6379/0'), decode_responses=True)

def app(config_class='config.DevelopmentConfig'):
    app = Flask(__name__)

    #Load the specified configuration
    app.config.from_object(config_class)

    #Initialize extensions with the app instance
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    swagger.init_app(app)

    #Import and register blueprints
    from blueprints.posts import posts_bp
    from blueprints.comments import comments_bp

    app.register_blueprint(posts_bp)
    app.register_blueprint(comments_bp)

    @app.route('/')
    def Home():
        return jsonify({
            "message": "Welcome to the Blog API!",
            "version": "1.0",
            "endpoints": {
                "posts": "/posts",
                "comments": "/posts/<post_id>/comments"
            }
        })
    
    @app.errorhandler(400)
    def bad_request(error):
        response = jsonify({'error': str(error)})
        response.status_code = 400
        return response
    
    return app

if __name__ == '__main__':
    app = app() 

    app.run(debug=True)