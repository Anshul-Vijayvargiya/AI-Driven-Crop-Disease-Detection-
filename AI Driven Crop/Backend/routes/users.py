from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.user import User
from utils.auth import admin_required

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@jwt_required()
@admin_required()
def get_users():
    try:
        user_model = User(request.db)
        
        # Simple user listing - in real app, add pagination and filtering
        users_cursor = request.db.users.find({}, {'password': 0})
        users = []
        for user in users_cursor:
            user['_id'] = str(user['_id'])
            users.append(user)
        
        return jsonify({'users': users}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    try:
        user_model = User(request.db)
        user = user_model.get_user_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500