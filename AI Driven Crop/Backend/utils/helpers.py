import re
from datetime import datetime
from bson import ObjectId

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number format"""
    pattern = r'^\+?1?\d{9,15}$'
    return re.match(pattern, phone) is not None

def format_timestamp(timestamp):
    """Format timestamp for display"""
    if isinstance(timestamp, str):
        return timestamp
    return timestamp.strftime('%Y-%m-%d %H:%M:%S') if timestamp else None

def is_valid_object_id(id_string):
    """Check if string is valid MongoDB ObjectId"""
    try:
        ObjectId(id_string)
        return True
    except:
        return False

def paginate_query(query, page, per_page):
    """Apply pagination to MongoDB query"""
    skip = (page - 1) * per_page
    return query.skip(skip).limit(per_page)

def sanitize_input(data):
    """Basic input sanitization"""
    if isinstance(data, str):
        # Remove potentially dangerous characters
        data = re.sub(r'[<>&\"\']', '', data)
    return data