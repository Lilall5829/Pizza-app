import { supabase } from './supabase';

export type UploadResult = {
  success: boolean;
  url?: string;
  error?: string;
};

/**
 * 上传图片到Supabase Storage
 * @param file - 图片文件
 * @param fileName - 文件名 (可选，会自动生成)
 * @returns 上传结果，包含公共URL
 */
export async function uploadImage(file: File, fileName?: string): Promise<UploadResult> {
  try {
    // 生成唯一文件名
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const finalFileName = fileName || `${timestamp}.${fileExt}`;
    
    // 上传到Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(finalFileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // 获取公共URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return { 
      success: true, 
      url: urlData.publicUrl 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
}

/**
 * 从URL下载图片并上传到Supabase
 * @param imageUrl - 图片URL (从AI生成或其他来源)
 * @param fileName - 自定义文件名
 */
export async function uploadImageFromUrl(imageUrl: string, fileName: string): Promise<UploadResult> {
  try {
    // 下载图片
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return { success: false, error: 'Failed to fetch image from URL' };
    }

    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });

    // 上传到Supabase
    return await uploadImage(file, fileName);
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Download and upload failed' 
    };
  }
}

/**
 * 删除图片
 * @param fileName - 要删除的文件名
 */
export async function deleteImage(fileName: string): Promise<UploadResult> {
  try {
    const { error } = await supabase.storage
      .from('product-images')
      .remove([fileName]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Delete failed' 
    };
  }
} 