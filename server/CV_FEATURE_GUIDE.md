# CV Upload and Download Feature Guide

## Overview

This feature allows admins to upload a CV (PDF) that can be downloaded by visitors from the frontend portfolio website.

## Features

- ✅ PDF CV upload (Admin only)
- ✅ Public CV download
- ✅ Download count tracking
- ✅ Only one active CV at a time (new uploads replace old ones)
- ✅ Automatic cleanup of old CV files
- ✅ File size validation (5MB max)

## API Endpoints

### 1. Upload CV (Admin Only)
**POST** `/api/cv/upload`

Upload a new CV file. This will replace any existing CV.

**Authentication:** Required (Bearer token)

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with field name `cv` containing the PDF file

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/cv/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "cv=@/path/to/your/cv.pdf"
```

**Response:**
```json
{
  "message": "CV uploaded successfully",
  "cv": {
    "id": "65f1234567890abcdef12345",
    "filename": "cv.pdf",
    "originalName": "My_Resume.pdf",
    "fileSize": 245678,
    "uploadedAt": "2024-01-15T10:30:00.000Z",
    "downloadCount": 0
  }
}
```

### 2. Get CV Info (Public)
**GET** `/api/cv`

Get information about the current active CV.

**Authentication:** Not required

**Response:**
```json
{
  "id": "65f1234567890abcdef12345",
  "filename": "My_Resume.pdf",
  "fileSize": 245678,
  "uploadedAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "downloadCount": 15,
  "downloadUrl": "/api/cv/download"
}
```

### 3. Download CV (Public)
**GET** `/api/cv/download`

Download the active CV file.

**Authentication:** Not required

**Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="original_filename.pdf"`
- File stream (PDF binary data)

**Example:**
```bash
curl -O http://localhost:5000/api/cv/download
```

### 4. Get CV Info (Admin)
**GET** `/api/cv/admin`

Get detailed CV information including file path (admin only).

**Authentication:** Required (Bearer token)

**Response:**
```json
{
  "_id": "65f1234567890abcdef12345",
  "filename": "cv.pdf",
  "originalName": "My_Resume.pdf",
  "filePath": "/uploads/cv/cv.pdf",
  "fileSize": 245678,
  "mimeType": "application/pdf",
  "uploadedBy": {
    "_id": "65f1234567890abcdef12346",
    "username": "admin",
    "email": "admin@example.com"
  },
  "isActive": true,
  "downloadCount": 15,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Frontend Integration

### Download Button Example (React)

```jsx
import { useState, useEffect } from 'react';

function DownloadCV() {
  const [cvInfo, setCvInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/cv')
      .then(res => res.json())
      .then(data => {
        setCvInfo(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching CV info:', err);
        setLoading(false);
      });
  }, []);

  const handleDownload = () => {
    if (cvInfo) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = `http://localhost:5000/api/cv/download`;
      link.download = cvInfo.filename || 'cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cvInfo) {
    return <div>CV not available</div>;
  }

  return (
    <div>
      <button onClick={handleDownload}>
        Download CV ({cvInfo.downloadCount} downloads)
      </button>
    </div>
  );
}
```

### Alternative: Direct Link

```jsx
<a 
  href="http://localhost:5000/api/cv/download" 
  download
  className="download-cv-button"
>
  Download My CV
</a>
```

### Using Axios (if needed)

```javascript
import axios from 'axios';

const downloadCV = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/cv/download', {
      responseType: 'blob', // Important for file downloads
    });

    // Create blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cv.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CV:', error);
    alert('Failed to download CV');
  }
};
```

## Admin Dashboard Integration

### Upload CV Component Example

```jsx
import { useState } from 'react';
import axios from 'axios';

function UploadCV() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setMessage('Only PDF files are allowed');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a PDF file');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await axios.post('/api/cv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('CV uploaded successfully!');
      setFile(null);
      // Reset file input
      document.getElementById('cv-upload').value = '';
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to upload CV'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload CV</h2>
      <input
        id="cv-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Upload CV'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
```

## File Storage

- **Location:** `server/uploads/cv/`
- **Filename:** `cv.pdf` (consistent name for easy access)
- **Old files:** Automatically deleted when a new CV is uploaded

## Error Responses

### 400 Bad Request
- `"No file uploaded. Please select a PDF file."` - No file in request
- `"File size too large. Maximum size is 5MB."` - File exceeds size limit
- `"Only PDF files are allowed for CV"` - Invalid file type

### 404 Not Found
- `"CV not found"` - No active CV exists
- `"CV file not found on server"` - File missing from disk

### 500 Internal Server Error
- `"Failed to upload CV"` - Server error during upload
- `"Failed to download CV"` - Server error during download

## Database Schema

The CV model stores:
- `filename`: Server filename (cv.pdf)
- `originalName`: Original uploaded filename
- `filePath`: Path relative to uploads directory
- `fileSize`: File size in bytes
- `mimeType`: MIME type (application/pdf)
- `uploadedBy`: Admin user ID who uploaded
- `isActive`: Boolean flag (only one active CV)
- `downloadCount`: Number of downloads
- `createdAt`: Upload timestamp
- `updatedAt`: Last update timestamp

## Security Notes

- ✅ Only authenticated admins can upload CVs
- ✅ Public download endpoint (no authentication required)
- ✅ File type validation (PDF only)
- ✅ File size limits (5MB max)
- ✅ Old files are cleaned up automatically
- ✅ Download count tracking

## Testing

### Test Upload (using curl)
```bash
curl -X POST http://localhost:5000/api/cv/upload \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "cv=@/path/to/your/resume.pdf"
```

### Test Download
```bash
curl -O http://localhost:5000/api/cv/download
```

### Test Get Info
```bash
curl http://localhost:5000/api/cv
```

## Notes

- Only one CV can be active at a time
- Uploading a new CV automatically deactivates and deletes the old one
- Download count increments each time someone downloads the CV
- Files are stored in `server/uploads/cv/` directory
- The CV is served as a static file download with proper headers

