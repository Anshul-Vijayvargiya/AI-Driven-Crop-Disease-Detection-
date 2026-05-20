from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def admin_required():
    """Decorator to require admin role"""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user = get_jwt_identity()
            if current_user.get('role') != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def owner_or_admin_required(model_class, id_param='user_id'):
    """Decorator to require owner or admin role"""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user = get_jwt_identity()
            
            # Allow if admin
            if current_user.get('role') == 'admin':
                return fn(*args, **kwargs)
            
            # Check if user owns the resource
            resource_id = kwargs.get(id_param)
            if not resource_id:
                return jsonify({'error': 'Resource ID required'}), 400
            
            # This would need to be adapted based on your specific models
            # For now, we'll check if the user_id in the resource matches current user
            if str(current_user['_id']) != resource_id:
                return jsonify({'error': 'Not authorized to access this resource'}), 403
            
            return fn(*args, **kwargs)
        return decorator
    return wrapper