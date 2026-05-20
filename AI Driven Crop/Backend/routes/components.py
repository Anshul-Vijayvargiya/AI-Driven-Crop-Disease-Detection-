from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.component import Component

components_bp = Blueprint('components', __name__)

@components_bp.route('/', methods=['GET'])
def get_components():
    try:
        component_model = Component(request.db)
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        category = request.args.get('category')
        component_type = request.args.get('type')
        
        filters = {}
        if category:
            filters['category'] = category
        if component_type:
            filters['type'] = component_type
        filters['is_public'] = True  # Only show public components
        
        result = component_model.get_components(filters, page, limit)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@components_bp.route('/', methods=['POST'])
@jwt_required()
def create_component():
    try:
        data = request.get_json()
        current_user = get_jwt_identity()
        
        if not data or not data.get('name') or not data.get('type') or not data.get('code'):
            return jsonify({'error': 'Name, type, and code are required'}), 400
        
        component_model = Component(request.db)
        component = component_model.create_component(data, current_user['_id'])
        
        return jsonify({
            'message': 'Component created successfully',
            'component': component
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@components_bp.route('/<component_id>', methods=['GET'])
def get_component(component_id):
    try:
        component_model = Component(request.db)
        component = component_model.get_component_by_id(component_id)
        
        if not component:
            return jsonify({'error': 'Component not found'}), 404
        
        if not component.get('is_public'):
            # Check if user is authenticated and is the owner
            try:
                current_user = get_jwt_identity()
                if component['user_id'] != current_user['_id']:
                    return jsonify({'error': 'Component not found'}), 404
            except:
                return jsonify({'error': 'Component not found'}), 404
        
        return jsonify({'component': component}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@components_bp.route('/<component_id>', methods=['PUT'])
@jwt_required()
def update_component(component_id):
    try:
        data = request.get_json()
        current_user = get_jwt_identity()
        
        component_model = Component(request.db)
        component, error = component_model.update_component(component_id, data, current_user['_id'])
        
        if error:
            return jsonify({'error': error}), 403
        
        return jsonify({
            'message': 'Component updated successfully',
            'component': component
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@components_bp.route('/<component_id>', methods=['DELETE'])
@jwt_required()
def delete_component(component_id):
    try:
        current_user = get_jwt_identity()
        
        component_model = Component(request.db)
        error = component_model.delete_component(component_id, current_user['_id'])
        
        if error:
            return jsonify({'error': error}), 403
        
        return jsonify({'message': 'Component deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@components_bp.route('/<component_id>/download', methods=['POST'])
def download_component(component_id):
    try:
        component_model = Component(request.db)
        component = component_model.get_component_by_id(component_id)
        
        if not component or not component.get('is_public'):
            return jsonify({'error': 'Component not found'}), 404
        
        component_model.increment_downloads(component_id)
        
        return jsonify({
            'message': 'Component downloaded successfully',
            'component': component
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500