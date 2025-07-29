from flask import Flask
from .extensions import db, migrate, cors, jwt, redis_client
from .routes import bp

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(bp)

    return app