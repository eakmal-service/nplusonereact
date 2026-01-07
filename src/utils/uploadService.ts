
// Service to handle image uploads
// Currently uses Cloudinary via a proxy API route

export interface UploadContext {
    type: 'product' | 'hero' | 'fav' | 'category' | 'banner' | 'other';
    category?: string;
    subcategory?: string;
    hsnCode?: string;
}

export const uploadImage = async (
    file: File,
    context: UploadContext = { type: 'product' },
    customPath?: string
): Promise<string | null> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        let folderPath = 'nplusone-fashion';

        // Helper to clean path segments
        const clean = (s: string) => s?.trim().replace(/[^a-zA-Z0-9 -]/g, '').trim() || 'General';

        if (context.type === 'product') {
            const cat = clean(context.category || 'Uncategorized');
            const sub = clean(context.subcategory || 'General');
            const hsn = clean(context.hsnCode || 'No-HSN');
            folderPath += `/Products images/${cat}/${sub}/${hsn}`;
        } else {
            const typeMap: Record<string, string> = {
                'hero': 'Hero section images',
                'fav': 'My Fav images',
                'category': 'Category images',
                'banner': 'Banner images',
                'other': 'Others'
            };
            folderPath += `/${typeMap[context.type] || 'Others'}`;
        }

        formData.append('folder', folderPath);
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
