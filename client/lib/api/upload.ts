import api from './index';
import { UploadResponse } from '@/types/api';
import { uploadMedia } from './media';

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  try {
    const result = await uploadMedia(file);
    return {
      success: result.success,
      url: result.url,
      public_id: result.public_id,
      message: 'Image uploaded successfully',
    };
  } catch {
    // Keep legacy endpoint as a local fallback while deployments move to media library.
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
