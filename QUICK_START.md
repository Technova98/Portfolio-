# Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB running (local or cloud)

## 5-Minute Setup

### 1. Install Dependencies
```bash
# Run the setup script
chmod +x setup.sh
./setup.sh
```

Or manually:
```bash
# Backend
cd server && npm install && cd ..

# Admin
cd admin && npm install && cd ..

# Frontend  
cd portfolio && npm install && cd ..
```

### 2. Configure Backend
```bash
cd server
cp .env.example .env
# Edit .env file with your MongoDB URI
```

### 3. Start Backend
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### 4. Create Admin Account
In a new terminal, use curl or Postman:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"password123"}'
```

### 5. Start Admin Panel
```bash
cd admin
npm run dev
# Admin runs on http://localhost:3001
```

### 6. Login
- Go to http://localhost:3001
- Login with your credentials
- Start managing your portfolio!

## URLs

- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3001
- **Frontend**: http://localhost:5173 (portfolio folder)

## MongoDB Setup

### Option 1: Local MongoDB
```bash
# Start MongoDB service
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create a cluster (free tier available)
3. Get connection string
4. Update `MONGO_URI` in `server/.env`

## What You Can Do

- **Dashboard**: View statistics
- **Projects**: Add/edit/delete portfolio projects
- **Contacts**: View incoming messages
- **Skills**: Manage your skills
- **About**: Edit your about section

## Troubleshooting

**MongoDB not connecting?**
- Check if MongoDB is running
- Verify MONGO_URI in .env
- For Atlas: whitelist your IP

**Can't login to admin?**
- Make sure backend is running
- Verify admin account was created
- Check browser console

**Port conflicts?**
- Change PORT in server/.env
- Kill process using the port

## Need Help?

See full documentation in:
- `README.md` - Complete overview
- `INSTALLATION.md` - Detailed setup
- `server/README.md` - Backend API docs
- `admin/README.md` - Admin panel docs

