export const FILE_CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
export const FILE_UPLOAD_BATCH_SIZE = 5;
export const MAX_FILE_UPLOAD_RETRIES = 3; 
export const MAX_FILE_UPLOAD_RETRY_DELAY = 3000; // 3 seconds
export const FILE_UPLOAD_TIMEOUT = 60000; // 30 seconds
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  export const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
    return 'other';
  };

  export const getFileParts = (file) => {
    const fileSize = file.size;
    const parts = [];
    for (let start = 0; start < fileSize; start += FILE_CHUNK_SIZE) {
        const end = Math.min(start + FILE_CHUNK_SIZE, fileSize);
        parts.push(file.slice(start, end));
    }
    return parts;
};