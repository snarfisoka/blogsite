# backend/config.py

class BaseConfig:
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(BaseConfig):
    # Use a persistent database file for normal development
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'

class TestingConfig(BaseConfig):
    # Use an in-memory database for running automated tests
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'