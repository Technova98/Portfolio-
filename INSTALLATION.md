# Installation Guide

Follow these steps to set up the complete portfolio system.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Step 1: Install Dependencies

### Backend Server
```bash
cd server
npm install
```

### Admin Panel
```bash
cd admin
npm install
```

### Frontend Portfolio
```bash
cd portfolio
npm install
```

## Step 2: Configure Backend

1. Copy environment file:
```bash
cd server
cp .env.example .env
```

2. Edit `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

## Step 3: Start MongoDB

### Local MongoDB
Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Cloud MongoDB (Atlas)
Update `MONGO_URI` in `.env` with your Atlas connection string.

## Step 4: Start the Backend Server

```bash
cd server
npm run dev
```

The server should be running on `http://localhost:5000`

## Step 5: Create Admin Account

Open a new terminal and run:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"yourpassword"}'
```

Or use Postman/Thunder Client to POST to `http://localhost:5000/api/auth/register`

## Step 6: Start Admin Panel

```bash
cd admin
npm run dev
```

Access the admin panel at `http://localhost:3001` and login with your credentials.

## Step 7: Start Frontend (Optional)

If you want to connect the frontend to the backend:

```bash
cd portfolio
npm run dev
```

The frontend will run on `http://localhost:5173`

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check the `MONGO_URI` in `.env`
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the port in `server/.env` or `package.json`
- Kill the process using the port

### Cannot Login to Admin Panel
- Make sure the backend server is running
- Verify admin account was created
- Check browser console for errors

## Testing the Setup

1. **Test Backend**: Visit `http://localhost:5000/api/health`
2. **Test Admin Login**: Go to `http://localhost:3001` and login
3. **Add a Project**: Use the admin panel to add your first project
4. **Test API**: Add a contact message from the frontend

## Next Steps

1. Login to the admin panel
2. Add your projects
3. Configure your about section
4. Add your skills
5. Start receiving contacts!

