#!/bin/bash

echo "🚀 Setting up Portfolio Backend & Admin Panel..."
echo ""

# Setup Backend
echo "📦 Installing backend dependencies..."
cd server
npm install
echo "✅ Backend dependencies installed"
echo ""

# Setup Admin
echo "📦 Installing admin panel dependencies..."
cd ../admin
npm install
echo "✅ Admin panel dependencies installed"
echo ""

# Setup Frontend
echo "📦 Installing frontend dependencies..."
cd ../portfolio
npm install
echo "✅ Frontend dependencies installed"
echo ""

cd ..
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure MongoDB connection in server/.env"
echo "2. Start backend: cd server && npm run dev"
echo "3. Create admin account (see README.md)"
echo "4. Start admin panel: cd admin && npm run dev"
echo "5. Start frontend: cd portfolio && npm run dev"
echo ""
echo "For detailed instructions, see INSTALLATION.md"

