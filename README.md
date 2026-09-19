# Portfolio Website with Backend & Admin Panel

A full-stack portfolio website with a React frontend, Node.js backend, and admin panel for content management.

## Project Structure

```
portfolio/
├── portfolio/          # Frontend portfolio website
├── server/            # Backend API server
└── admin/             # Admin panel (React)
```

## Features

### Frontend Portfolio
- Modern, responsive design with dark mode
- Dynamic content from backend API
- Contact form integration
- Portfolio projects showcase
- Skills display

### Backend API
- RESTful API with Express.js
- MongoDB database
- JWT authentication
- CRUD operations for all content
- CORS enabled

### Admin Panel
- Secure authentication
- Dashboard with statistics
- Manage projects, skills, about section
- View and manage contact messages
- Beautiful, modern UI

## Quick Start

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configurations
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

Admin panel runs on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd portfolio
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` (or check your Vite port)

## First Time Configuration

### Create Admin Account

Before accessing the admin panel, you need to create an admin account:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"yourpassword"}'
```

Or use any REST client (Postman, Thunder Client, etc.)

### Configure Environment

1. Update `server/.env` with your MongoDB connection string
2. Set a secure `JWT_SECRET`
3. (Optional) Configure email settings for contact notifications

## MongoDB Setup

Install MongoDB if you haven't already:
- Download from [MongoDB website](https://www.mongodb.com/try/download/community)
- Or use MongoDB Atlas (cloud)

Update the `MONGO_URI` in `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/portfolio_db
# Or for Atlas:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin (protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Contacts
- `GET /api/contacts` - Get all contacts (protected)
- `POST /api/contacts` - Create contact (public)
- `PUT /api/contacts/:id` - Update contact (protected)
- `DELETE /api/contacts/:id` - Delete contact (protected)

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (protected)
- `PUT /api/skills/:id` - Update skill (protected)
- `DELETE /api/skills/:id` - Delete skill (protected)

### About
- `GET /api/about` - Get about section
- `POST /api/about` - Update about (protected)

## Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3001

## Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Framer Motion
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

### Admin Panel
- React 19
- React Router
- Axios
- Tailwind CSS
- Framer Motion

## Development

Each part runs independently:
- Frontend: `npm run dev` in `/portfolio`
- Backend: `npm run dev` in `/server`
- Admin: `npm run dev` in `/admin`

## Production Deployment

1. Build frontend: `npm run build` in `/portfolio`
2. Build admin: `npm run build` in `/admin`
3. Start backend: `npm start` in `/server`
4. Configure environment variables
5. Set up MongoDB
6. Configure domain and CORS

## License

MIT

