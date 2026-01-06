
// Service to handle image uploads
// Currently uses Cloudinary via a proxy API route

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
        return data.url;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};
