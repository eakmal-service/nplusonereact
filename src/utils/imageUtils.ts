/**
 * Utility functions for handling image uploads and storage
 */

/**
 * Convert a File object to a data URL
 */
export const fileToDataUrl = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Process multiple image files and return their data URLs
 */
export const processImageFiles = async (files: File[]): Promise<string[]> => {
  const dataUrls = await Promise.all(files.map(file => fileToDataUrl(file)));
  return dataUrls;
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): boolean => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return false;
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return false;
  }
  
  return true;
};

/**
 * Process and optimize image for storage
 */
export const optimizeImage = async (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set maximum dimensions
      const maxWidth = 1200;
      const maxHeight = 1200;
      
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and optimize image
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8)); // 80% quality JPEG
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}; 