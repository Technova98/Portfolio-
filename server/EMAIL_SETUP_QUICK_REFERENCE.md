# 📧 Email Setup Quick Reference

## ✅ Complete .env Configuration

Create or edit `server/.env` with these exact settings:

```env
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/portfolio_db

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_SETUP_SECRET=one_time_setup_secret

# SMTP Email Configuration for Contact Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=marefu933@gmail.com
SMTP_PASS=your_16_character_app_password_here
EMAIL_TO=marefu933@gmail.com

# Optional
NODE_ENV=development
```

## 🔑 Getting Gmail App Password

1. Visit: https://myaccount.google.com/apppasswords
2. Sign in to your Google account
3. Select "Mail" as the app
4. Select "Other (Custom name)" as the device
5. Enter "Portfolio Contact Form" as the name
6. Click "Generate"
7. Copy the 16-character password (remove spaces)
8. Paste it as `SMTP_PASS` in your `.env` file

## 🧪 Testing Email Configuration

### Method 1: Admin Dashboard (Recommended)
1. Log into admin dashboard
2. Navigate to **Contacts** page
3. Click **"Test Email"** button
4. Check the success/error message
5. Check your inbox for the test email

### Method 2: Server Console
After submitting a contact form, check the server console for:
- ✅ `SMTP connection verified successfully`
- ✅ `Email sent successfully!`
- ❌ Error messages with specific details

## 📋 Troubleshooting Checklist

- [ ] `.env` file exists in `server/` directory
- [ ] All SMTP variables are set (no missing values)
- [ ] Using App Password (not regular password)
- [ ] 2-Step Verification enabled on Google account
- [ ] Server restarted after editing `.env`
- [ ] Test Email button shows success message
- [ ] Checked spam/junk folder in email inbox

## 🚨 Common Errors

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `EAUTH` | Authentication failed | Use App Password, not regular password |
| `ECONNECTION` | Connection failed | Check internet/firewall settings |
| `ETIMEDOUT` | Connection timeout | Try port 587 with `SMTP_SECURE=false` |
| `EENVELOPE` | Invalid email | Check `EMAIL_TO` value in `.env` |

## 📞 Support

For more help, see:
- `EMAIL_TROUBLESHOOTING.md` - Detailed troubleshooting guide
- `README.md` - General server documentation
- Server console logs - Real-time error messages

