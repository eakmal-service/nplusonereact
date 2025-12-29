import { supabase } from '@/lib/supabaseClient';

/**
 * Uploads an image to Supabase Storage
 * @param file The file object to upload
 * @param bucket The storage bucket name (default: 'product-images')
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (
    file: File,
    bucket: string = 'product-images',
    customPath?: string
): Promise<string | null> => {
    try {
        // 1. Create a unique file name or use custom path
        let filePath;
        if (customPath) {
            filePath = customPath;
        } else {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            filePath = fileName;
        }

        // 2. Upload the file
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return null;
        }

        // 3. Get the public URL
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Unexpected error uploading image:', error);
        return null;
    }
};
