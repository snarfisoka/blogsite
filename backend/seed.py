from app import create_app, db
from app.models import Post

app = create_app()
with app.app_context():
    post = Post(title="Hello World", content="This is a sample post.")
    db.session.add(post)
    db.session.commit()
    print("Seeded the database.")
