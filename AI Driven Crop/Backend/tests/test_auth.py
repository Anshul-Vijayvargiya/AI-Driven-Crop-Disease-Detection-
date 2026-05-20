import pytest
import json
from app import create_app
from config import TestingConfig

class TestAuth:
    def setup_method(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.auth_url = '/api/auth'
        
        # Test user data
        self.user_data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'password': 'testpassword123'
        }

    def test_user_registration(self):
        """Test user registration"""
        response = self.client.post(
            f'{self.auth_url}/register',
            data=json.dumps(self.user_data),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'access_token' in data
        assert data['user']['email'] == self.user_data['email']

    def test_user_login(self):
        """Test user login"""
        # First register
        self.client.post(
            f'{self.auth_url}/register',
            data=json.dumps(self.user_data),
            content_type='application/json'
        )
        
        # Then login
        response = self.client.post(
            f'{self.auth_url}/login',
            data=json.dumps({
                'email': self.user_data['email'],
                'password': self.user_data['password']
            }),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'access_token' in data

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        response = self.client.post(
            f'{self.auth_url}/login',
            data=json.dumps({
                'email': 'wrong@example.com',
                'password': 'wrongpassword'
            }),
            content_type='application/json'
        )
        
        assert response.status_code == 401