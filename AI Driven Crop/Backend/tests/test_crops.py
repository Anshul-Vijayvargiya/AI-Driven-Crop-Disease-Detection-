import pytest
import json
from app import create_app

class TestCrops:
    def setup_method(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.crops_url = '/api/crops'
        
        # Register and login a test user
        self.user_data = {
            'name': 'Test Farmer',
            'email': 'farmer@example.com',
            'password': 'farmpassword123'
        }
        
        # Register user
        auth_response = self.client.post(
            '/api/auth/register',
            data=json.dumps(self.user_data),
            content_type='application/json'
        )
        auth_data = json.loads(auth_response.data)
        self.access_token = auth_data['access_token']
        
        # Test crop data
        self.crop_data = {
            'name': 'Test Tomato',
            'category': 'vegetable',
            'planting_season': ['spring'],
            'description': 'A test tomato variety'
        }

    def test_create_crop(self):
        """Test creating a new crop"""
        response = self.client.post(
            self.crops_url,
            data=json.dumps(self.crop_data),
            content_type='application/json',
            headers={'Authorization': f'Bearer {self.access_token}'}
        )
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['crop']['name'] == self.crop_data['name']

    def test_get_crops(self):
        """Test getting crops list"""
        response = self.client.get(self.crops_url)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'crops' in data