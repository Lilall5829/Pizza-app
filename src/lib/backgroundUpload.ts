import { supabase } from './supabase';

export type UploadBackgroundResult = {
  success: boolean;
  url?: string;
  error?: string;
};

/**
 * 上传背景图片到 Supabase Storage
 * @param file - 图片文件
 * @param fileName - 文件名（可选，默认为 auth-background）
 * @returns Promise<UploadBackgroundResult>
 */
export async function uploadBackgroundImage(
  file: File, 
  fileName: string = 'auth-background'
): Promise<UploadBackgroundResult> {
  try {
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Only JPEG, PNG, and WebP images are allowed'
      };
    }

    // 验证文件大小（5MB）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      };
    }

    // 生成文件名（包含扩展名）
    const fileExt = file.name.split('.').pop();
    const fullFileName = `${fileName}.${fileExt}`;

    // 删除旧文件（如果存在）
    await supabase.storage
      .from('backgrounds')
      .remove([fullFileName]);

    // 上传新文件
    const { data, error } = await supabase.storage
      .from('backgrounds')
      .upload(fullFileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    // 获取公共 URL
    const { data: { publicUrl } } = supabase.storage
      .from('backgrounds')
      .getPublicUrl(fullFileName);

    return {
      success: true,
      url: publicUrl
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * 获取背景图片的公共 URL
 * @param fileName - 文件名
 * @returns 公共 URL
 */
export function getBackgroundImageUrl(fileName: string = 'auth-background.png'): string {
  const { data: { publicUrl } } = supabase.storage
    .from('backgrounds')
    .getPublicUrl(fileName);
  
  // 修复双斜杠问题
  const fixedUrl = publicUrl.replace('//', '/').replace('http:/', 'http://').replace('https:/', 'https://');
  
  return fixedUrl;
}

/**
 * 列出所有背景图片
 */
export async function listBackgroundImages() {
  const { data, error } = await supabase.storage
    .from('backgrounds')
    .list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    });

  if (error) {
    throw error;
  }

  return data || [];
} 