# 📧 Email Configuration Setup Guide

## Issue: Email Not Sending

The email notification feature is implemented but requires SMTP configuration.

## ✅ Solution: Add SMTP Settings to .env

Your `.env` file is currently missing the email configuration. Here's what you need to add:

### Current .env (incomplete):
```env
MONGO_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your_secret_key
```

### Updated .env (with email):
```env
MONGO_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your_secret_key

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_TO=marefu933@gmail.com
```

---

## 📝 Step-by-Step Setup Instructions

### Option 1: Gmail (Recommended)

1. **Go to Google Account Settings:**
   - Visit: https://myaccount.google.com/
   - Click **Security** in the left sidebar

2. **Enable 2-Step Verification:**
   - Scroll down to "How you sign in to Google"
   - Click **2-Step Verification**
   - Follow the setup process

3. **Generate App Password:**
   - Go back to Security settings
   - Click **App passwords**
   - Select "Mail" as app type
   - Select "Other (Custom name)" as device
   - Name it "Portfolio Contact Form"
   - Click **Generate**
   - Copy the 16-character password (example: `abcd efgh ijkl mnop`)

4. **Update .env file:**
   ```env
   SMTP_USER=marefu933@gmail.com
   SMTP_PASS=abcdefghijklmnop
   ```

---

### Option 2: Other Email Providers

#### Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
EMAIL_TO=marefu933@gmail.com
```

#### Yahoo Mail:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@yahoo.com
SMTP_PASS=your_app_password
EMAIL_TO=marefu933@gmail.com
```

#### Custom SMTP:
```env
SMTP_HOST=your_smtp_server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@domain.com
SMTP_PASS=your_password
EMAIL_TO=marefu933@gmail.com
```

---

## 🔍 Testing the Configuration

After adding SMTP settings:

1. **Restart your server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Submit the contact form** on your portfolio website

3. **Check the server console** for messages:
   - ✅ "Email sent successfully: <message-id>"
   - ❌ "Email not sent: SMTP configuration missing"
   - ❌ "Contact email send failed: <error details>"

4. **Check your email inbox** for the notification

---

## 🛠️ Troubleshooting

### Error: "Authentication failed"
- **Gmail:** Make sure you're using an App Password, not your regular password
- **Other providers:** Verify username and password are correct

### Error: "Connection timeout"
- Check your firewall settings
- Try changing `SMTP_SECURE=false` and `SMTP_PORT=587`

### Error: "Email not sent: SMTP configuration missing"
- Make sure `.env` file is in the `server/` directory
- Restart the server after editing `.env`
- Check that SMTP_USER and SMTP_PASS are set

### Console shows "Email not sent: SMTP configuration missing"
- Your `.env` file is missing the email variables
- Add the SMTP configuration as shown above

---

## 📋 Quick Checklist

- [ ] `.env` file exists in `server/` directory
- [ ] Added SMTP_HOST, SMTP_PORT, SMTP_SECURE to `.env`
- [ ] Added SMTP_USER and SMTP_PASS to `.env`
- [ ] Added EMAIL_TO to `.env`
- [ ] Restarted the server after editing `.env`
- [ ] Tested contact form submission
- [ ] Checked server console for email status
- [ ] Checked email inbox

---

## 💡 Pro Tips

1. **Never commit .env to git** - it contains sensitive credentials
2. **Use environment variables in production** - don't hardcode passwords
3. **Test email sending regularly** to ensure it's working
4. **Check spam folder** if emails don't arrive
5. **Server console logs** will tell you exactly what's happening

---

**Need help?** Check the main `CONFIGURATION_GUIDE.md` for more details.

