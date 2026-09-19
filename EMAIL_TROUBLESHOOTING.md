# 🔧 Email Not Sending - Troubleshooting Guide

## ❌ Current Problem

**Email notifications are not working** because your `.env` file is missing the SMTP configuration.

---

## ✅ The Solution

Your `.env` file currently has:
```env
MONGO_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your_secret_key
```

But it's missing the email configuration!

---

## 🛠️ Fix It Now (Choose One Method)

### Method 1: Automatic Setup (Easiest)

1. Open PowerShell in the `server/` directory
2. Run the helper script:
   ```powershell
   .\ADD_EMAIL_CONFIG.ps1
   ```
3. Edit `.env` file and replace placeholders:
   - Replace `your_email@gmail.com` with your actual Gmail
   - Replace `your_app_password_here` with your Gmail App Password

### Method 2: Manual Setup

Edit `server/.env` and add this at the bottom:

```env
MONGO_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your_secret_key

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=marefu933@gmail.com
SMTP_PASS=your_gmail_app_password_here
EMAIL_TO=marefu933@gmail.com
```

---

## 📱 How to Get Gmail App Password

1. **Go to:** https://myaccount.google.com/security
2. **Enable 2-Step Verification** (if not already enabled)
3. **Click "App passwords"** (at the bottom)
4. **Select:**
   - App: Mail
   - Device: Other (Custom name)
   - Name: Portfolio Contact Form
5. **Click "Generate"**
6. **Copy the 16-character password** (format: `abcd efgh ijkl mnop`)
7. **Paste it in `.env` as `SMTP_PASS`** (remove spaces)

---

## 🔄 After Configuration

1. **Restart your server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Test Email Configuration (NEW!):**
   - Log into the admin dashboard
   - Go to the **Contacts** page
   - Click the **"Test Email"** button (blue button next to Refresh)
   - Check for success/error message
   - If successful, check your inbox for the test email

3. **Watch the console** for these messages:
   - ✅ "✅ SMTP connection verified successfully"
   - ✅ "✅ Email sent successfully!"
   - ❌ "⚠️  Email not sent: SMTP configuration missing"
   - ❌ "❌ SMTP connection verification failed"
   - ❌ "❌ Failed to send contact notification email"

4. **Test the contact form** from your portfolio website

5. **Check your email inbox** at `marefu933@gmail.com`

---

## 🐛 Still Not Working?

### Check These:

1. **Is SMTP config in `.env`?**
   - Open `server/.env` and verify SMTP variables exist
   - Make sure there are no spaces around the `=` sign
   - Make sure values are not in quotes (unless needed)

2. **Did you restart the server?**
   - After editing `.env`, you MUST restart the server
   - Stop the server (Ctrl+C) and start again: `npm run dev`

3. **Are credentials correct?**
   - Use **App Password**, not regular password for Gmail
   - Check for typos in email addresses
   - Make sure 2-Step Verification is enabled on your Google account

4. **Test Email from Admin Dashboard:**
   - Use the "Test Email" button in the Contacts page
   - This will verify your SMTP configuration
   - Check the error message for specific issues

5. **Check console output:**
   - Server will log detailed information:
     - `📧 Attempting to send contact notification email...`
     - Configuration details (host, port, secure, from, to)
     - `✅ SMTP connection verified successfully` or error details
     - `✅ Email sent successfully!` or error message

6. **Common Error Codes:**
   - **EAUTH**: Authentication failed - use App Password, not regular password
   - **ECONNECTION/ETIMEDOUT**: Connection issue - check internet/firewall
   - **EENVELOPE**: Invalid email address - check EMAIL_TO value

7. **Firewall blocking?**
   - Try changing to `SMTP_PORT=587` and `SMTP_SECURE=false`
   - Make sure your firewall allows outbound connections on port 465 or 587

---

## 📋 Quick Diagnostic Commands

Check if .env has email config:
```powershell
cd server
Select-String -Path .env -Pattern "SMTP" 
```

See recent server logs:
```powershell
# Look for these messages in the server console:
# - "Email configuration check:"
# - "Email sent successfully"
# - "Email not sent: SMTP configuration missing"
# - "Contact email send failed"
```

---

## 📞 What Was Implemented

The code is already working! It includes:
- ✅ Email sending when contact form is submitted
- ✅ Non-blocking (won't fail if email has issues)
- ✅ **NEW: Test Email button** in admin dashboard
- ✅ **NEW: SMTP connection verification** before sending
- ✅ **NEW: Enhanced error messages** with helpful tips
- ✅ **NEW: HTML email formatting** for better readability
- ✅ Detailed console logging with emojis for easy identification
- ✅ Graceful error handling
- ✅ Support for Gmail, Outlook, custom SMTP

**You just need to configure the SMTP settings in `.env`!**

---

## 🎯 Summary

| Issue | Solution |
|-------|----------|
| Email not sending | Add SMTP config to `.env` |
| Missing .env file | Create it in `server/` directory |
| Gmail auth fails | Use App Password, not regular password |
| Connection timeout | Try port 587 with `SMTP_SECURE=false` |
| Still not working | Check server console for detailed error logs |

---

**For more help:** See `server/EMAIL_SETUP.md` or `CONFIGURATION_GUIDE.md`

