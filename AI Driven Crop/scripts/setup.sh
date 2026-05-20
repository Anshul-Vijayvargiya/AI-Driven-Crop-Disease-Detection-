#!/bin/bash

echo "Setting up Complete UI Prompts Application..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is required but not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is required but not installed. Please install MongoDB."
    exit 1
fi

# Setup backend
echo "Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file. Please update with your configuration."
fi

# Setup frontend
echo "Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
npm install

echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start MongoDB: mongod"
echo "2. Start backend: cd backend && source venv/bin/activate && python app.py"
echo "3. Start frontend: cd frontend && npm run dev"
echo ""
echo "Or use Docker: docker-compose up -d"