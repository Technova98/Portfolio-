# Portfolio Backend Server

Backend API for the portfolio website and admin panel.

## Features

- RESTful API for managing projects, contacts, skills, and about section
- JWT authentication for admin access
- MongoDB database integration
- CORS enabled for frontend access

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin (first time only)
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
- `GET /api/contacts/unread/count` - Get unread count (protected)
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact (protected)
- `DELETE /api/contacts/:id` - Delete contact (protected)

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (protected)
- `PUT /api/skills/:id` - Update skill (protected)
- `DELETE /api/skills/:id` - Delete skill (protected)

### About
- `GET /api/about` - Get about section
- `POST /api/about` - Create/update about (protected)
- `PUT /api/about` - Update about (protected)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `server` directory and configure the required environment variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_SETUP_SECRET=one_time_setup_secret

# SMTP configuration used by the contact form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=marefu933@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_TO=marefu933@gmail.com

# Optional
NODE_ENV=development
```

> **Note:** When using Gmail you must generate an [app password](https://support.google.com/accounts/answer/185833) and place it in `SMTP_PASS`. Regular account passwords will be rejected.

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## First Time Setup

Before using the admin panel, you need to create an admin account. You can do this by making a POST request to `/api/auth/register`:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"yourpassword"}'
```

Or use Postman/Thunder Client to register.

Then use the admin credentials to login in the admin panel at `http://localhost:3001`

