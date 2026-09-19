# 🔐 Password Reset via Email - Implementation Guide

## Overview

Password reset functionality has been added to the admin authentication system. Users can now request a password reset via email and reset their password using a secure token.

## Features

- ✅ Secure token-based password reset
- ✅ Email notifications with reset links
- ✅ Token expiration (10 minutes)
- ✅ Email confirmation after successful reset
- ✅ Prevents email enumeration attacks
- ✅ Beautiful HTML email templates

## API Endpoints

### 1. Request Password Reset
**POST** `/api/auth/forgot-password`

Request a password reset email.

**Request Body:**
```json
{
  "email": "admin@example.com"
}
```

**Response:**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Note:** The response is always the same regardless of whether the email exists to prevent email enumeration.

### 2. Reset Password with Token
**POST** `/api/auth/reset-password/:token`

Reset password using the token from the email.

**URL Parameters:**
- `token` - The reset token from the email link

**Request Body:**
```json
{
  "password": "newSecurePassword123"
}
```

**Response:**
```json
{
  "message": "Password has been reset successfully"
}
```

**Error Responses:**
- `400` - Invalid or expired token
- `400` - Password is required or too short (minimum 6 characters)

## Configuration

### Environment Variables

Add to your `server/.env` file:

```env
# Frontend URL (for reset link generation)
FRONTEND_URL=http://localhost:3001

# SMTP Configuration (required for email sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_TO=your_email@gmail.com
```

**Note:** If `FRONTEND_URL` is not set, it defaults to `http://localhost:3001`.

### Gmail Setup

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Portfolio Password Reset"
   - Copy the 16-character password
   - Use it as `SMTP_PASS` in your `.env` file

## How It Works

1. **User requests reset:**
   - User submits email to `/api/auth/forgot-password`
   - System generates a secure random token
   - Token is hashed and stored in database with expiration (10 minutes)
   - Email is sent with reset link

2. **User clicks link:**
   - Link format: `http://localhost:3001/reset-password/{token}`
   - Frontend should extract token and call the reset endpoint

3. **User resets password:**
   - Frontend sends token and new password to `/api/auth/reset-password/:token`
   - System validates token and expiration
   - Password is updated
   - Confirmation email is sent
   - Reset token is cleared

## Security Features

- ✅ Tokens are hashed before storage (SHA-256)
- ✅ Tokens expire after 10 minutes
- ✅ Tokens are single-use (cleared after reset)
- ✅ Email enumeration prevention (same response for all emails)
- ✅ Password validation (minimum 6 characters)

## Frontend Integration Example

### Request Reset
```javascript
const requestPasswordReset = async (email) => {
  const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  return data;
};
```

### Reset Password
```javascript
const resetPassword = async (token, newPassword) => {
  const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: newPassword }),
  });
  const data = await response.json();
  return data;
};
```

## Testing

1. **Test Request Reset:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com"}'
   ```

2. **Check Email:**
   - Check the admin's email inbox
   - Look for "Password Reset Request" email
   - Copy the token from the reset link

3. **Test Reset:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/reset-password/YOUR_TOKEN_HERE \
     -H "Content-Type: application/json" \
     -d '{"password":"newPassword123"}'
   ```

## Troubleshooting

### Email Not Sending
- Check SMTP configuration in `.env`
- Verify Gmail App Password is correct
- Check server logs for error messages
- Ensure 2-Step Verification is enabled on Gmail

### Token Expired
- Tokens expire after 10 minutes
- Request a new reset link if expired

### Invalid Token
- Token may have already been used
- Token may be malformed
- Request a new reset link

## Files Modified/Created

- ✅ `server/models/Admin.js` - Added reset token fields and method
- ✅ `server/controllers/authController.js` - Added forgot/reset functions
- ✅ `server/routes/authRoutes.js` - Added new routes
- ✅ `server/utils/emailService.js` - Email service utility (new)

