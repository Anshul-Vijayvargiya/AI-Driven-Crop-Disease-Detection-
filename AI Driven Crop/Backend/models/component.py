from datetime import datetime
from bson import ObjectId

class Component:
    def __init__(self, db):
        self.collection = db.components
    
    def create_component(self, component_data, user_id):
        """Create a new UI component"""
        component = {
            'name': component_data['name'],
            'type': component_data['type'],
            'category': component_data.get('category', 'general'),
            'code': component_data['code'],
            'preview_image': component_data.get('preview_image'),
            'tags': component_data.get('tags', []),
            'user_id': user_id,
            'is_public': component_data.get('is_public', True),
            'likes': 0,
            'downloads': 0,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(component)
        component['_id'] = str(result.inserted_id)
        return component
    
    def get_components(self, filters=None, page=1, limit=20):
        """Get components with optional filtering and pagination"""
        filters = filters or {}
        query = {}
        
        if 'category' in filters:
            query['category'] = filters['category']
        if 'type' in filters:
            query['type'] = filters['type']
        if 'tags' in filters:
            query['tags'] = {'$in': filters['tags']}
        if 'is_public' in filters:
            query['is_public'] = filters['is_public']
        
        skip = (page - 1) * limit
        components = list(self.collection.find(query).skip(skip).limit(limit))
        
        # Convert ObjectId to string
        for component in components:
            component['_id'] = str(component['_id'])
        
        total = self.collection.count_documents(query)
        
        return {
            'components': components,
            'total': total,
            'page': page,
            'limit': limit,
            'pages': (total + limit - 1) // limit
        }
    
    def get_component_by_id(self, component_id):
        """Get component by ID"""
        try:
            component = self.collection.find_one({'_id': ObjectId(component_id)})
            if component:
                component['_id'] = str(component['_id'])
            return component
        except:
            return None
    
    def update_component(self, component_id, update_data, user_id):
        """Update component - only by owner"""
        component = self.get_component_by_id(component_id)
        if not component:
            return None, 'Component not found'
        
        if component['user_id'] != user_id:
            return None, 'Not authorized to update this component'
        
        update_data['updated_at'] = datetime.utcnow()
        result = self.collection.update_one(
            {'_id': ObjectId(component_id)},
            {'$set': update_data}
        )
        
        if result.modified_count:
            return self.get_component_by_id(component_id), None
        return None, 'Update failed'
    
    def delete_component(self, component_id, user_id):
        """Delete component - only by owner"""
        component = self.get_component_by_id(component_id)
        if not component:
            return 'Component not found'
        
        if component['user_id'] != user_id:
            return 'Not authorized to delete this component'
        
        result = self.collection.delete_one({'_id': ObjectId(component_id)})
        return None if result.deleted_count else 'Delete failed'
    
    def increment_downloads(self, component_id):
        """Increment download count"""
        self.collection.update_one(
            {'_id': ObjectId(component_id)},
            {'$inc': {'downloads': 1}}
        )