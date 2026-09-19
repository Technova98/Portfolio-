# Profile Photo Upload Fix

## Issues Fixed

### 1. Multer Error Handling
**Problem:** Multer errors were not being properly caught and returned to the client, causing silent failures.

**Solution:** 
- Wrapped multer middleware in a custom error handler
- Added proper error responses for file size limits and invalid file types
- Improved error messages for better user feedback

### 2. File Type Validation
**Problem:** Only basic MIME types were checked.

**Solution:**
- Added 'image/jpg' to allowed types (in addition to 'image/jpeg')
- Added client-side validation before upload
- Better error messages for invalid file types

### 3. Old Avatar Cleanup
**Problem:** Old avatar files were not being deleted when uploading new ones, causing disk space waste.

**Solution:**
- Added logic to delete old avatar file before saving new one
- Graceful error handling if deletion fails (continues with upload)

### 4. Frontend Error Handling
**Problem:** Frontend didn't handle all error cases properly.

**Solution:**
- Added client-side file validation (type and size)
- Improved error message display
- Better handling of different response structures
- More descriptive error messages

## Changes Made

### Backend (`server/controllers/adminController.js`)
1. ✅ Improved multer error handling with custom middleware wrapper
2. ✅ Added old avatar deletion before saving new one
3. ✅ Better error messages and logging
4. ✅ Added 'image/jpg' to allowed file types

### Frontend (`admin/src/components/Settings.jsx`)
1. ✅ Added client-side file validation (type and size checks)
2. ✅ Improved error handling and user feedback
3. ✅ Better response structure handling
4. ✅ More descriptive error messages

## Testing

To test the upload functionality:

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the admin dashboard:**
   ```bash
   cd admin
   npm run dev
   ```

3. **Test upload:**
   - Navigate to Settings > Profile
   - Click the camera icon on the profile picture
   - Select an image file (JPEG, PNG, or WEBP)
   - Click "Upload Photo"
   - Verify the image updates successfully

## Supported File Types
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WEBP (.webp)

## File Size Limit
- Maximum: 2MB

## API Endpoint
- **PUT** `/api/admin/profile/photo`
- **Auth:** Required (Bearer token)
- **Content-Type:** `multipart/form-data`
- **Field Name:** `avatar`

## Error Responses

### 400 Bad Request
- `"No file uploaded. Please select an image file."` - No file in request
- `"File size too large. Maximum size is 2MB."` - File exceeds size limit
- `"Only JPEG, PNG, and WEBP images are allowed"` - Invalid file type

### 404 Not Found
- `"Admin not found"` - Admin user doesn't exist

### 500 Internal Server Error
- `"Failed to update profile photo"` - Server error during update

## Notes

- Old avatar files are automatically deleted when uploading new ones
- Uploads are stored in `server/uploads/avatars/`
- Files are named: `{adminId}-{timestamp}.{ext}`
- Static files are served from `/uploads` route

