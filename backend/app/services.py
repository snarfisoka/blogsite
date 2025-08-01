import json
from flask import current_app

CACHE_EXPIRATION_SECONDS = 300 # Cache for 5 minutes

def get_post_from_cache(post_id):
    """Tries to retrieve a post from the Redis cache."""
    redis_client = current_app.redis_client
    return redis_client.get(f"post:{post_id}")

def set_post_in_cache(post_id, post_object):
    """Stores a post object in the Redis cache."""
    redis_client = current_app.redis_client
    # We serialize the dict representation of the object to a JSON string
    post_json = json.dumps(post_object.to_dict())
    redis_client.set(f"post:{post_id}", post_json, ex=CACHE_EXPIRATION_SECONDS)