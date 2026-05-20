from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from config import config
import os

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app, resources={r"/*": {"origins": "*"}})
    jwt = JWTManager(app)
    
    # MongoDB connection
    client = MongoClient(app.config['MONGO_URI'])
    app.db = client.get_database()

    @app.before_request
    def before_request():
        request.db = app.db

    # Ensure upload folder exists
    upload_folder = app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    # Register blueprints
    from routes.auth import auth_bp
    from routes.users import users_bp
    from routes.components import components_bp
    from routes.crops import crops_bp
    from routes.weather import weather_bp
    from routes.prediction import prediction_bp
    from routes.mandi import mandi_bp
    
    app.register_blueprint(mandi_bp, url_prefix='/api/mandi')
    app.register_blueprint(weather_bp, url_prefix='/api/weather')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(components_bp, url_prefix='/api/components')
    app.register_blueprint(crops_bp, url_prefix='/api/crops')
    app.register_blueprint(prediction_bp, url_prefix='/api/predict')

    # Root endpoint
    @app.route('/')
    def home():
        return jsonify({
            'status': 'healthy',
            'message': 'AI Driven Crop Detection API',
            'version': '1.0.0',
            'endpoints': {
                'health': '/api/health',
                'predict': '/api/predict',
                'auth': '/api/auth',
                'users': '/api/users',
                'crops': '/api/crops',
                'components': '/api/components'
            }
        })
    @app.route('/api', methods=['GET'])
    def api_root():
        return jsonify({
            'message': 'API is running',
            'version': '1.0.0'
        }), 200

    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'AI Driven Crop Detection API is running',
            'database': 'Connected' if app.db is not None else 'Disconnected'
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app(os.getenv('FLASK_CONFIG', 'default'))
    app.run(host='0.0.0.0', port=5000, debug=app.config['DEBUG'], use_reloader=False)