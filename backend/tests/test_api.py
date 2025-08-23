from models import Post, Comment

def test_create_post(client, db):
    data = {'title': 'Test Post', 'content': 'This is a test post.'}
    response = client.post('/posts', json=data)
    assert response.status_code == 201
    assert 'Post created successfully!' in response.json['message']


    post = db.session.get(Post, 1)
    assert post.title == 'Test Post'

def test_get_posts(client, db):
    new_post = Post(title='Post to get', content='Content of post')
    db.session.add(new_post)
    db.session.commit()

    response = client.get('/posts')
    assert response.status_code == 200
    assert len(response.json['posts']) == 1
    assert 'Post to get' in response.json['posts'][0]['title']

def test_delete_post(client, db):
    new_post = Post(title='Post to delete', content='Content of post')
    db.session.add(new_post)
    db.session.commit()
    new_comment = Comment(text='A comment', post_id=new_post.id)
    db.session.add(new_comment)
    db.session.commit()

    response = client.delete(f'/posts/{new_post.id}')
    assert response.status_code == 200
    assert 'Post deleted successfully!' in response.json['message']
    
    assert db.session.get(Post, new_post.id) is None
    assert db.session.get(Comment, new_comment.id) is None

def test_add_comment(client, db):
    new_post = Post(title='Post for Comments', content='This post will have comments.')
    db.session.add(new_post)
    db.session.commit()

    comment_data = {'text': 'This is a test comment.'}
    response = client.post(f'/posts/{new_post.id}/comments', json=comment_data)

    assert response.status_code == 201
    assert 'Comment added successfully!' in response.json['message']

    comment = Comment.query.filter_by(post_id=new_post.id).first()
    assert comment is not None
    assert comment.text == 'This is a test comment.'

def test_get_comments(client, db):
    new_post = Post(title='Post with multiple comments', content='This post has comments.')
    db.session.add(new_post)
    db.session.commit()

    comment1 = Comment(text='First comment.', post_id=new_post.id)
    comment2 = Comment(text='Second comment.', post_id=new_post.id)
    db.session.add_all([comment1, comment2])
    db.session.commit()

    response = client.get(f'/posts/{new_post.id}/comments')

    assert response.status_code == 200
    assert len(response.json) == 2
    assert response.json[0]['text'] == "First comment."
    assert response.json[1]['text'] == "Second comment."

def test_rate_comment(client, db):
    new_post = Post(title='Post to rate a comment on', content='Post.')
    db.session.add(new_post)
    db.session.commit()

    new_comment = Comment(text='A comment to be rates.', post_id=new_post.id)
    db.session.add(new_comment)
    db.session.commit()

    rating_data = {'rating': 5}
    response = client.put(f'/comments/{new_comment.id}/rate', json=rating_data)

    assert response.status_code == 200
    assert 'Comment rated successfully!' in response.json['message']

    comment = db.session.get(Comment, new_comment.id)
    assert comment.rating == 5