from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400

        user_model = User(current_app.db)
        user, error = user_model.create_user(data)

        if error:
            return jsonify({'error': error}), 400

        # Use user ID as JWT identity
        access_token = create_access_token(identity=str(user['_id']))

        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': user
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400

        user_model = User(current_app.db)
        user, error = user_model.authenticate_user(data['email'], data['password'])

        if error:
            return jsonify({'error': error}), 401

        access_token = create_access_token(identity=str(user['_id']))

        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()  # this is the string _id
        user_model = User(current_app.db)
        user = user_model.get_user_by_id(current_user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': user}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500