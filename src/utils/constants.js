export const API_URL = import.meta.env.VITE_API_URL;

export const FILE_TYPES = {
  PDF: 'pdf',
  DOC: 'doc',
  DOCX: 'docx',
  TXT: 'txt',
  RTF: 'rtf'
};

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/rtf'
];

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB