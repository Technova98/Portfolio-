import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modern HTML email template generator
const generateContactEmailTemplate = (contact) => {
  const formattedDate = new Date(contact.createdAt).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #334155;
            background: #f8fafc;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        /* Header */
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .email-header h1 {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .email-header p {
            opacity: 0.9;
            font-size: 0.95rem;
        }
        
        /* Content */
        .email-content {
            padding: 2rem;
        }
        
        .message-alert {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .message-alert svg {
            flex-shrink: 0;
            color: #0369a1;
        }
        
        .contact-details {
            background: #f8fafc;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .detail-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .detail-value {
            font-weight: 500;
            color: #1e293b;
        }
        
        .email-link {
            color: #3b82f6;
            text-decoration: none;
        }
        
        .email-link:hover {
            color: #2563eb;
            text-decoration: underline;
        }
        
        /* Message section */
        .message-section {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1.5rem;
        }
        
        .message-section h3 {
            color: #1e293b;
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .message-content {
            color: #475569;
            line-height: 1.7;
            white-space: pre-wrap;
            background: #f8fafc;
            padding: 1rem;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
        }
        
        /* Footer */
        .email-footer {
            background: #f1f5f9;
            padding: 1.5rem;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
            color: #64748b;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
        
        .reply-notice {
            background: #dcfce7;
            color: #166534;
            padding: 0.75rem;
            border-radius: 6px;
            font-size: 0.875rem;
            margin-top: 1rem;
            border: 1px solid #bbf7d0;
        }
        
        /* Responsive */
        @media (max-width: 480px) {
            .email-header {
                padding: 1.5rem 1rem;
            }
            
            .email-content {
                padding: 1.5rem 1rem;
            }
            
            .detail-grid {
                grid-template-columns: 1fr;
            }
            
            .message-alert {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>📬 New Contact Message</h1>
            <p>You've received a new message from your portfolio website</p>
        </div>
        
        <!-- Content -->
        <div class="email-content">
            <div class="message-alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <div>
                    <strong>New contact form submission</strong>
                    <div style="font-size: 0.875rem; opacity: 0.8;">Received on ${formattedDate}</div>
                </div>
            </div>
            
            <div class="contact-details">
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">From</span>
                        <span class="detail-value">${contact.name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">
                            <a href="mailto:${
                              contact.email
                            }" class="email-link">${contact.email}</a>
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Subject</span>
                        <span class="detail-value">${
                          contact.subject || "No subject provided"
                        }</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Date</span>
                        <span class="detail-value">${formattedDate}</span>
                    </div>
                </div>
            </div>
            
            <div class="message-section">
                <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"></path>
                        <polyline points="2,6 12,13 22,6"></polyline>
                    </svg>
                    Message
                </h3>
                <div class="message-content">${contact.message}</div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <p class="footer-text">This message was sent from your portfolio contact form</p>
            <div class="reply-notice">
                💡 <strong>Quick Reply:</strong> You can reply directly to this email to respond to ${
                  contact.name
                }
            </div>
        </div>
    </div>
</body>
</html>
  `.trim();
};

// Plain text fallback generator
const generatePlainTextEmail = (contact) => {
  const formattedDate = new Date(contact.createdAt).toLocaleString();

  return `
NEW CONTACT FORM SUBMISSION

You've received a new message from your portfolio website.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:    ${contact.name}
Email:   ${contact.email}
Subject: ${contact.subject || "No subject provided"}
Date:    ${formattedDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${contact.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUICK ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Reply directly to this email to contact ${contact.name}
• View all messages in your admin dashboard

This message was sent from your portfolio contact form.
  `.trim();
};

// Modern email sending function
const sendContactNotificationEmail = async (contact) => {
  try {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS,
      EMAIL_TO,
    } = process.env;

    // Validate configuration
    if (!SMTP_USER || !SMTP_PASS) {
      console.warn("⚠️  Email not sent: SMTP configuration missing");
      console.warn("   Please add SMTP_USER and SMTP_PASS to your .env file");
      console.warn("   Gmail users: Enable 2FA and use an App Password");
      return { success: false, error: "SMTP configuration missing" };
    }

    // Parse configuration with defaults
    const host = SMTP_HOST || "smtp.gmail.com";
    const port = SMTP_PORT ? parseInt(SMTP_PORT, 10) : 465;
    const secure =
      SMTP_SECURE === "false"
        ? false
        : SMTP_SECURE === "true"
        ? true
        : port === 465;
    const toAddress = EMAIL_TO || SMTP_USER;

    console.log("📧 Sending contact notification...");
    console.log(`   Server: ${host}:${port} (${secure ? "SSL" : "No SSL"})`);
    console.log(`   Recipient: ${toAddress}`);

    // Create transporter with better configuration
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certs in development
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 15000,
      debug: process.env.NODE_ENV === "development",
      logger: process.env.NODE_ENV === "development",
    });

    // Verify connection
    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified");
    } catch (verifyError) {
      console.error("❌ SMTP connection failed:", verifyError.message);
      if (verifyError.code === "EAUTH") {
        console.error("   🔐 Authentication issues?");
        console.error("   • Check if 2FA is enabled on your email");
        console.error(
          "   • Use an App Password instead of your regular password"
        );
        console.error("   • Gmail: https://myaccount.google.com/apppasswords");
      }
      return { success: false, error: verifyError.message };
    }

    // Generate email content
    const subject = `New message from ${contact.name}: ${
      contact.subject || "Contact Form"
    }`;
    const html = generateContactEmailTemplate(contact);
    const text = generatePlainTextEmail(contact);

    // Send email
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${SMTP_USER}>`,
      to: toAddress,
      replyTo: contact.email, // Important: enables direct replies to the sender
      subject,
      text,
      html,
      priority: "high", // Mark as important
    });

    console.log("✅ Email sent successfully!");
    console.log(`   Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error(`   Error: ${error.message}`);

    // Enhanced error diagnostics
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }
    if (error.responseCode) {
      console.error(`   Response Code: ${error.responseCode}`);
    }
    if (error.command) {
      console.error(`   Command: ${error.command}`);
    }

    // Helpful troubleshooting tips
    if (error.code === "EAUTH") {
      console.error(
        "   🔐 Solution: Use an App Password (not your regular password)"
      );
    } else if (error.code === "ECONNECTION") {
      console.error(
        "   🌐 Solution: Check your internet and SMTP server settings"
      );
    } else if (error.code === "EMSGSIZE") {
      console.error(
        "   📎 Solution: Message too large - check for large attachments"
      );
    }

    return { success: false, error: error.message };
  }
};

// @desc    Create contact
// @route   POST /api/contacts
// @access  Public
export const createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    // Send notification email (non-blocking)
    sendContactNotificationEmail(contact)
      .then((result) => {
        if (result.success) {
          console.log(`📨 Notification sent for contact from ${contact.name}`);
        } else {
          console.warn(
            `⚠️  Email notification failed for ${contact.name}: ${result.error}`
          );
        }
      })
      .catch((err) => {
        console.error("Email sending error:", err);
      });

    res.status(201).json({
      ...contact.toJSON(),
      message: "Contact message sent successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update contact (mark as read)
// @route   PUT /api/contacts/:id
// @access  Private
export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread count
// @route   GET /api/contacts/unread/count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Contact.countDocuments({ read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Test email configuration
// @route   POST /api/contacts/test-email
// @access  Private
export const testEmail = async (req, res) => {
  try {
    // Create a mock contact for testing
    const testContact = {
      name: "Test User",
      email: "test@example.com",
      subject: "Test Message from Portfolio",
      message:
        "This is a test message to verify your email configuration is working correctly. If you receive this, your portfolio contact form is ready to receive messages!",
      createdAt: new Date(),
    };

    const result = await sendContactNotificationEmail(testContact);

    if (result.success) {
      res.json({
        success: true,
        message: "Test email sent successfully!",
        messageId: result.messageId,
        config: {
          from: process.env.SMTP_USER,
          to: process.env.EMAIL_TO || process.env.SMTP_USER,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: "Failed to send test email",
      });
    }
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Unexpected error during test email",
    });
  }
};
