// src/utils/validation.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Password must be at least 6 characters
  return password.length >= 6;
};

export const validateFile = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'File type not allowed. Please upload PDF, DOC, DOCX, TXT, or RTF file.'
    };
  }

  // Check file size (max 5MB)
  if (file.size > MAX_UPLOAD_SIZE) {
    return { 
      valid: false, 
      error: 'File too large. Maximum file size is 5MB.'
    };
  }

  return { valid: true };
};

// Import needed for validateFile
import { ALLOWED_FILE_TYPES, MAX_UPLOAD_SIZE } from './constants';