from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.crop import Crop
import base64

crops_bp = Blueprint('crops', __name__)

@crops_bp.route('/', methods=['GET'])
def get_crops():
    try:
        crop_model = Crop(request.db)
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        category = request.args.get('category')
        planting_season = request.args.getlist('planting_season')
        climate_zone = request.args.getlist('climate_zone')
        search = request.args.get('search')
        sort_by = request.args.get('sort_by', 'name')
        sort_order = request.args.get('sort_order', 'asc')
        
        filters = {'is_public': True}
        if category:
            filters['category'] = category
        if planting_season:
            filters['planting_season'] = planting_season
        if climate_zone:
            filters['climate_zones'] = climate_zone
        if search:
            filters['search'] = search
        if sort_by:
            filters['sort_by'] = sort_by
        if sort_order:
            filters['sort_order'] = sort_order
        
        result = crop_model.get_crops(filters, page, limit)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/', methods=['POST'])
@jwt_required()
def create_crop():
    try:
        data = request.get_json()
        current_user = get_jwt_identity()
        
        if not data or not data.get('name') or not data.get('category'):
            return jsonify({'error': 'Name and category are required'}), 400
        
        crop_model = Crop(request.db)
        crop = crop_model.create_crop(data, current_user['_id'])
        
        return jsonify({
            'message': 'Crop created successfully',
            'crop': crop
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/<crop_id>', methods=['GET'])
def get_crop(crop_id):
    try:
        crop_model = Crop(request.db)
        crop = crop_model.get_crop_by_id(crop_id)
        
        if not crop:
            return jsonify({'error': 'Crop not found'}), 404
        
        if not crop.get('is_public'):
            # Check if user is authenticated and is the owner or admin
            try:
                current_user = get_jwt_identity()
                user_collection = request.db.users
                user = user_collection.find_one({'_id': ObjectId(current_user['_id'])})
                is_admin = user and user.get('role') == 'admin'
                
                if not is_admin and crop['user_id'] != current_user['_id']:
                    return jsonify({'error': 'Crop not found'}), 404
            except:
                return jsonify({'error': 'Crop not found'}), 404
        
        return jsonify({'crop': crop}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/<crop_id>', methods=['PUT'])
@jwt_required()
def update_crop(crop_id):
    try:
        data = request.get_json()
        current_user = get_jwt_identity()
        
        crop_model = Crop(request.db)
        crop, error = crop_model.update_crop(crop_id, data, current_user['_id'])
        
        if error:
            return jsonify({'error': error}), 403
        
        return jsonify({
            'message': 'Crop updated successfully',
            'crop': crop
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/<crop_id>', methods=['DELETE'])
@jwt_required()
def delete_crop(crop_id):
    try:
        current_user = get_jwt_identity()
        
        crop_model = Crop(request.db)
        error = crop_model.delete_crop(crop_id, current_user['_id'])
        
        if error:
            return jsonify({'error': error}), 403
        
        return jsonify({'message': 'Crop deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/categories', methods=['GET'])
def get_crop_categories():
    try:
        crop_model = Crop(request.db)
        categories = crop_model.get_crop_categories()
        return jsonify({'categories': categories}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/seasons', methods=['GET'])
def get_planting_seasons():
    try:
        crop_model = Crop(request.db)
        seasons = crop_model.get_planting_seasons()
        return jsonify({'seasons': seasons}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/climate/<climate_zone>', methods=['GET'])
def get_crops_by_climate(climate_zone):
    try:
        crop_model = Crop(request.db)
        crops = crop_model.get_crops_by_climate_zone(climate_zone)
        return jsonify({'crops': crops}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/search', methods=['GET'])
def search_crops():
    try:
        query = request.args.get('q', '')
        category = request.args.get('category')
        climate_zone = request.args.get('climate_zone')
        
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        
        crop_model = Crop(request.db)
        filters = {'is_public': True}
        if category:
            filters['category'] = category
        if climate_zone:
            filters['climate_zone'] = climate_zone
        
        crops = crop_model.search_crops(query, filters)
        return jsonify({'crops': crops}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crops_bp.route('/<crop_id>/images', methods=['POST'])
@jwt_required()
def add_crop_image(crop_id):
    try:
        data = request.get_json()
        if not data or not data.get('image_data') or not data.get('image_name'):
            return jsonify({'error': 'Image data and name are required'}), 400
        
        crop_model = Crop(request.db)
        crop, error = crop_model.add_crop_image(
            crop_id, 
            data['image_data'], 
            data['image_name']
        )
        
        if error:
            return jsonify({'error': error}), 400
        
        return jsonify({
            'message': 'Image added successfully',
            'crop': crop
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500