# Portfolio Admin Dashboard Configuration Guide

## 📧 Email Notification Setup

**⚠️ IMPORTANT: Email notifications are implemented but NOT configured yet!**

Your `.env` file is missing SMTP settings. Follow these steps to enable email notifications.

### Quick Setup (Automatic)

Run this PowerShell script in the `server/` directory:
```powershell
cd server
.\ADD_EMAIL_CONFIG.ps1
```

Then edit `.env` and replace the placeholder values.

### Manual Setup

#### 1. Backend Email Configuration

Edit `server/.env` file and add the following SMTP configuration:

```env
# SMTP Email Configuration (Required for contact form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_TO=marefu933@gmail.com

# If you're using Gmail, you need to:
# 1. Enable 2-factor authentication
# 2. Generate an "App Password" from Google Account settings
# 3. Use the app password instead of your regular password
```

### 2. Gmail App Password Setup

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** > **2-Step Verification**
3. At the bottom, click **App passwords**
4. Select "Mail" as the app and "Other" as the device
5. Generate and copy the 16-character password
6. Use this password in `SMTP_PASS`

### 3. Other Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```

**Custom SMTP Server:**
```env
SMTP_HOST=your_smtp_server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@domain.com
SMTP_PASS=your_password
```

**Important:** The email sending happens in the background and won't block the contact form submission if it fails. Check server logs for any email delivery issues.

---

## 👤 Admin Profile Photo Upload

### Upload Process

1. **Login to Admin Dashboard** at `http://localhost:3001`
2. **Navigate to Settings** from the sidebar
3. **Go to Profile tab** (default)
4. **Upload Profile Photo:**
   - Click "Choose File" to select an image (PNG, JPEG, or WEBP)
   - Image size limit: 2MB
   - Click "Upload" button
   - Your profile photo will be displayed in the header

### Backend Configuration

The upload functionality is already configured. Files are stored in `server/uploads/avatars/` directory and served at `http://localhost:5000/uploads/avatars/`.

### Avatar Display

- **Header:** Your avatar appears in the top-right corner with username and email
- **Default Avatar:** A gradient circle with icon is shown if no photo is uploaded
- **Settings Page:** Preview and update your photo anytime

---

## 🎨 Features Implemented

### ✅ Email Notifications
- Automatic email when contact form is submitted
- Non-blocking email sending (won't affect form submission)
- Configurable SMTP settings
- Pre-filled email with sender's contact info

### ✅ Admin Profile Management
- Upload/update profile photo
- Avatar display in header
- Gradient default avatar
- Profile information display

### ✅ Modern UI Enhancements
- **Login Page:** Redesigned with gradient background, glassmorphism effect
- **Header:** Glass effect, gradient branding, admin avatar display
- **Sidebar:** Modern gradient active states, improved hover effects
- **Dashboard:** Enhanced stat cards, better animations
- **Dark Mode:** Toggle button in header (under development)

### ✅ Interactive Elements
- Smooth hover transitions on all buttons
- Loading states for async operations
- Success/error notifications
- Responsive design for all screen sizes

---

## 🚀 Quick Start

1. **Start Backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start Admin Panel:**
   ```bash
   cd admin
   npm install
   npm run dev
   ```

3. **Start Portfolio Frontend:**
   ```bash
   cd portfolio
   npm install
   npm run dev
   ```

4. **Access Points:**
   - Portfolio: http://localhost:5173
   - Admin Dashboard: http://localhost:3001
   - Backend API: http://localhost:5000

---

## 📝 Environment Variables Summary

### Backend (`server/.env`)
```env
# Database
MONGO_URI=mongodb://localhost:27017/portfolio_db

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email (Optional but recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_TO=marefu933@gmail.com
```

### Admin Panel (`admin/.env` - optional)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### Email Not Sending
- Check `SMTP_USER` and `SMTP_PASS` are correct
- Verify SMTP settings for your provider
- Check server console for error messages
- Contact form will still work even if email fails

### Avatar Not Displaying
- Make sure backend is running on port 5000
- Check browser console for image loading errors
- Verify file was uploaded successfully in `server/uploads/avatars/`
- Clear browser cache

### Profile Photo Upload Fails
- Check file size is under 2MB
- Verify file is PNG, JPEG, or WEBP format
- Make sure backend is running
- Check server console for errors

---

## 📧 Test Contact Form

1. Go to `http://localhost:5173`
2. Scroll to Contact section
3. Fill out the form and submit
4. Check:
   - MongoDB for saved message
   - Your email inbox for notification
   - Admin dashboard for the message

---

**Need Help?** Check the main `README.md` or `CONTACT_FEATURE.md` for more details.

