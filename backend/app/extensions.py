from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import redis

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
jwt = JWTManager()
redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)