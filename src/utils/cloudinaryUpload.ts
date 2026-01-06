
import { v2 as cloudinary } from 'cloudinary';

// Note: Cloudinary Node SDK works server-side. For client-side uploads, we usually call an API route.
// However, since we are using this mostly for Admin Panel (which might be client-side), 
// we normally need a signed upload endpoint. 
// BUT, for the request "upload_assets.js" script, we can use the SDK directly.
// For the Frontend "uploadImage" utility, we will need to create an API route to handle the upload 
// to avoid exposing API Secret in client bundle.

// Let's create a Client-Side friendly upload function that calls our own API route.

/**
 * Uploads a file to Cloudinary via our internal API Route
 * @param file The file to upload
 * @param folder The folder in Cloudinary (default: 'nplus-products')
 */
export const uploadImage = async (
    file: File,
    folder: string = 'nplus-products',
    customPath?: string
): Promise<string | null> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        if (customPath) formData.append('public_id', customPath);

        const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            console.error('Upload failed');
            return null;
        }

        const data = await response.json();
        return data.url; // specific field from our API response
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};
