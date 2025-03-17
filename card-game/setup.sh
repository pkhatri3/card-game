#!/bin/bash

echo "🔍 Checking if Node.js is installed..."
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed!"

echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "🚀 Setup complete! To start the project:"
echo "🔹 Open two terminals"
echo "🔹 Run 'node backend/server.js' for backend"
echo "🔹 Run 'npm run dev' inside frontend for frontend"
