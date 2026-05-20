from datetime import datetime
from bson import ObjectId
import base64
from io import BytesIO
from PIL import Image
import requests

class Crop:
    def __init__(self, db):
        self.collection = db.crops
    
    def create_crop(self, crop_data, user_id):
        """Create a new crop entry"""
        crop = {
            'name': crop_data['name'],
            'scientific_name': crop_data.get('scientific_name'),
            'category': crop_data['category'],  # vegetable, fruit, grain, etc.
            'variety': crop_data.get('variety', ''),
            'planting_season': crop_data.get('planting_season', []),
            'harvest_season': crop_data.get('harvest_season', []),
            'growth_days': crop_data.get('growth_days', 0),
            'water_requirements': crop_data.get('water_requirements', 'medium'),
            'sunlight_requirements': crop_data.get('sunlight_requirements', 'full_sun'),
            'soil_type': crop_data.get('soil_type', 'loamy'),
            'ph_range': crop_data.get('ph_range', {'min': 6.0, 'max': 7.0}),
            'nutritional_info': crop_data.get('nutritional_info', {}),
            'pests': crop_data.get('pests', []),
            'diseases': crop_data.get('diseases', []),
            'images': crop_data.get('images', []),
            'description': crop_data.get('description', ''),
            'growing_tips': crop_data.get('growing_tips', []),
            'harvesting_tips': crop_data.get('harvesting_tips', []),
            'storage_conditions': crop_data.get('storage_conditions', {}),
            'yield_per_hectare': crop_data.get('yield_per_hectare', {}),
            'climate_zones': crop_data.get('climate_zones', []),
            'companion_plants': crop_data.get('companion_plants', []),
            'user_id': user_id,
            'is_public': crop_data.get('is_public', True),
            'verified': crop_data.get('verified', False),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(crop)
        crop['_id'] = str(result.inserted_id)
        return crop
    
    def get_crops(self, filters=None, page=1, limit=20):
        """Get crops with filtering and pagination"""
        filters = filters or {}
        query = {}
        
        if 'category' in filters:
            query['category'] = filters['category']
        if 'planting_season' in filters:
            query['planting_season'] = {'$in': filters['planting_season']}
        if 'climate_zones' in filters:
            query['climate_zones'] = {'$in': filters['climate_zones']}
        if 'search' in filters:
            query['$or'] = [
                {'name': {'$regex': filters['search'], '$options': 'i'}},
                {'scientific_name': {'$regex': filters['search'], '$options': 'i'}},
                {'variety': {'$regex': filters['search'], '$options': 'i'}}
            ]
        if 'is_public' in filters:
            query['is_public'] = filters['is_public']
        
        skip = (page - 1) * limit
        sort_field = filters.get('sort_by', 'name')
        sort_order = 1 if filters.get('sort_order', 'asc') == 'asc' else -1
        
        crops = list(self.collection.find(query)
                    .sort(sort_field, sort_order)
                    .skip(skip)
                    .limit(limit))
        
        # Convert ObjectId to string
        for crop in crops:
            crop['_id'] = str(crop['_id'])
        
        total = self.collection.count_documents(query)
        
        return {
            'crops': crops,
            'total': total,
            'page': page,
            'limit': limit,
            'pages': (total + limit - 1) // limit
        }
    
    def get_crop_by_id(self, crop_id):
        """Get crop by ID"""
        try:
            crop = self.collection.find_one({'_id': ObjectId(crop_id)})
            if crop:
                crop['_id'] = str(crop['_id'])
            return crop
        except:
            return None
    
    def update_crop(self, crop_id, update_data, user_id):
        """Update crop - only by owner or admin"""
        crop = self.get_crop_by_id(crop_id)
        if not crop:
            return None, 'Crop not found'
        
        # Allow admin to update any crop
        user_collection = self.collection.database.users
        user = user_collection.find_one({'_id': ObjectId(user_id)})
        is_admin = user and user.get('role') == 'admin'
        
        if not is_admin and crop['user_id'] != user_id:
            return None, 'Not authorized to update this crop'
        
        update_data['updated_at'] = datetime.utcnow()
        result = self.collection.update_one(
            {'_id': ObjectId(crop_id)},
            {'$set': update_data}
        )
        
        if result.modified_count:
            return self.get_crop_by_id(crop_id), None
        return None, 'Update failed'
    
    def delete_crop(self, crop_id, user_id):
        """Delete crop - only by owner or admin"""
        crop = self.get_crop_by_id(crop_id)
        if not crop:
            return 'Crop not found'
        
        # Allow admin to delete any crop
        user_collection = self.collection.database.users
        user = user_collection.find_one({'_id': ObjectId(user_id)})
        is_admin = user and user.get('role') == 'admin'
        
        if not is_admin and crop['user_id'] != user_id:
            return 'Not authorized to delete this crop'
        
        result = self.collection.delete_one({'_id': ObjectId(crop_id)})
        return None if result.deleted_count else 'Delete failed'
    
    def get_crop_categories(self):
        """Get all unique crop categories"""
        return self.collection.distinct('category')
    
    def get_planting_seasons(self):
        """Get all unique planting seasons"""
        return self.collection.distinct('planting_season')
    
    def add_crop_image(self, crop_id, image_data, image_name):
        """Add image to crop"""
        try:
            # In a real application, you'd want to store images in cloud storage
            # For simplicity, we'll store base64 encoded images
            crop = self.get_crop_by_id(crop_id)
            if not crop:
                return None, 'Crop not found'
            
            image_entry = {
                'id': str(ObjectId()),
                'name': image_name,
                'data': image_data,
                'uploaded_at': datetime.utcnow()
            }
            
            result = self.collection.update_one(
                {'_id': ObjectId(crop_id)},
                {'$push': {'images': image_entry}}
            )
            
            if result.modified_count:
                return self.get_crop_by_id(crop_id), None
            return None, 'Failed to add image'
        except Exception as e:
            return None, str(e)
    
    def get_crops_by_climate_zone(self, climate_zone):
        """Get crops suitable for specific climate zone"""
        crops = list(self.collection.find({
            'climate_zones': climate_zone,
            'is_public': True
        }))
        
        for crop in crops:
            crop['_id'] = str(crop['_id'])
        
        return crops
    
    def search_crops(self, query, filters=None):
        """Search crops by name, scientific name, or description"""
        filters = filters or {}
        search_query = {
            '$and': [
                {
                    '$or': [
                        {'name': {'$regex': query, '$options': 'i'}},
                        {'scientific_name': {'$regex': query, '$options': 'i'}},
                        {'description': {'$regex': query, '$options': 'i'}},
                        {'variety': {'$regex': query, '$options': 'i'}}
                    ]
                }
            ]
        }
        
        if 'category' in filters:
            search_query['$and'].append({'category': filters['category']})
        if 'climate_zone' in filters:
            search_query['$and'].append({'climate_zones': filters['climate_zone']})
        if 'is_public' in filters:
            search_query['$and'].append({'is_public': filters['is_public']})
        
        crops = list(self.collection.find(search_query))
        for crop in crops:
            crop['_id'] = str(crop['_id'])
        
        return crops