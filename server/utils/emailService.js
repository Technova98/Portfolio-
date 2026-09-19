import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP configuration is missing. Please configure SMTP_USER and SMTP_PASS in your .env file');
  }

  const host = SMTP_HOST || 'smtp.gmail.com';
  const port = SMTP_PORT ? parseInt(SMTP_PORT, 10) : 465;
  const secure =
    SMTP_SECURE === 'false'
      ? false
      : SMTP_SECURE === 'true'
      ? true
      : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, adminName = 'Admin') => {
  try {
    const transporter = createTransporter();
    const { SMTP_USER } = process.env;

    // Create reset URL (adjust frontend URL as needed)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password/${resetToken}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #334155;
            background: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 40px 30px;
        }
        .email-body p {
            margin: 0 0 20px 0;
            color: #475569;
            font-size: 16px;
        }
        .reset-button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }
        .reset-button:hover {
            opacity: 0.9;
        }
        .reset-link {
            word-break: break-all;
            color: #667eea;
            text-decoration: none;
        }
        .email-footer {
            background: #f8fafc;
            padding: 20px 30px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
        }
        .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="email-body">
            <p>Hello ${adminName},</p>
            <p>You have requested to reset your password for your admin account. Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}" class="reset-link">${resetUrl}</a></p>
            
            <div class="warning">
                <p><strong>⚠️ Important:</strong> This link will expire in 10 minutes. If you didn't request this password reset, please ignore this email.</p>
            </div>
        </div>
        <div class="email-footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
    `;

    const text = `
Password Reset Request

Hello ${adminName},

You have requested to reset your password for your admin account.

Click the following link to reset your password:
${resetUrl}

⚠️ Important: This link will expire in 10 minutes.

If you didn't request this password reset, please ignore this email.

This is an automated message. Please do not reply to this email.
    `;

    const info = await transporter.sendMail({
      from: `"Portfolio Admin" <${SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request - Portfolio Admin',
      text,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset confirmation email
export const sendPasswordResetConfirmation = async (email, adminName = 'Admin') => {
  try {
    const transporter = createTransporter();
    const { SMTP_USER } = process.env;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #334155;
            background: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 40px 30px;
        }
        .email-body p {
            margin: 0 0 20px 0;
            color: #475569;
            font-size: 16px;
        }
        .email-footer {
            background: #f8fafc;
            padding: 20px 30px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>✅ Password Reset Successful</h1>
        </div>
        <div class="email-body">
            <p>Hello ${adminName},</p>
            <p>Your password has been successfully reset.</p>
            <p>If you did not make this change, please contact support immediately.</p>
        </div>
        <div class="email-footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
    `;

    const text = `
Password Reset Successful

Hello ${adminName},

Your password has been successfully reset.

If you did not make this change, please contact support immediately.

This is an automated message. Please do not reply to this email.
    `;

    const info = await transporter.sendMail({
      from: `"Portfolio Admin" <${SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Successful - Portfolio Admin',
      text,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: error.message };
  }
};

