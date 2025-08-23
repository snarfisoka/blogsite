import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from app import app, db as _db
from config import TestingConfig
from models import Post, Comment

@pytest.fixture(scope='session')
def test_app():
    app.config.from_object(TestingConfig)
    with app.app_context():
        yield app

@pytest.fixture(scope='function')
def client(test_app):
    return test_app.test_client()

@pytest.fixture(scope='function')
def db(test_app):
    with test_app.app_context():
        _db.create_all()
        yield _db
        _db.drop_all()


@pytest.fixture(scope='function')
def session(db):
    connection = db.engine.connect()
    transaction = connection.begin()
    db.session.begin_nested()

    yield db.session

    db.session.close()
    transaction.rollback()
    connection.close()