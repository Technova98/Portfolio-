# PowerShell script to add email configuration to .env file

Write-Host "`n📧 Adding Email Configuration to .env file...`n" -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file first with basic configuration.`n" -ForegroundColor Yellow
    exit 1
}

# Read current .env content
$envContent = Get-Content .env -Raw

# Check if email config already exists
if ($envContent -match "SMTP_USER") {
    Write-Host "⚠️  Email configuration already exists in .env" -ForegroundColor Yellow
    Write-Host "Manually edit the SMTP settings if needed.`n" -ForegroundColor Yellow
    exit 0
}

# Add email configuration
$emailConfig = @"

# SMTP Email Configuration (for contact form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
EMAIL_TO=marefu933@gmail.com

# Instructions:
# 1. Replace 'your_email@gmail.com' with your Gmail address
# 2. Generate App Password from Google Account settings
# 3. Replace 'your_app_password_here' with the 16-character app password
# 4. Save and restart the server
"@

# Append to .env file
Add-Content -Path .env -Value $emailConfig

Write-Host "✅ Email configuration added to .env!`n" -ForegroundColor Green
Write-Host "⚠️  IMPORTANT: You must edit .env and replace placeholder values:" -ForegroundColor Yellow
Write-Host "   - SMTP_USER=your_email@gmail.com" -ForegroundColor White
Write-Host "   - SMTP_PASS=your_app_password_here`n" -ForegroundColor White
Write-Host "After editing, restart your server to apply changes.`n" -ForegroundColor Cyan

