from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from .models import db
from .routes import api_bp
import redis

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    Migrate(app, db)
    CORS(app)

    app.redis_client = redis.from_url(app.config['REDIS_URL'])

    app.register_blueprint(api_bp, url_prefix='/api')

    return app