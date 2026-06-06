from app import create_app
import os

app = create_app(os.getenv('FLASK_CONFIG', 'default'))

if __name__ == '__main__':
    print("LOADED CORS_ORIGINS:", app.config.get('CORS_ORIGINS'))
    print("LOADED MONGO_URI:", app.config.get('MONGO_URI'))
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)