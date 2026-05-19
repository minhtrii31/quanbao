import api, { apiRequest } from './index';
import type { ApiRequestConfig } from './index';
import { ApiResponse, MediaItem, MediaParams, MediaResponse } from '@/types/api';

type MediaEnvelope = ApiResponse<MediaItem> & { media: MediaItem; url: string; public_id: string };
type MediaListEnvelope = ApiResponse<MediaItem[]> & MediaResponse;

export const getMedia = async (params?: MediaParams, config?: ApiRequestConfig): Promise<MediaResponse> => {
  const response = await apiRequest.get<MediaListEnvelope>('/admin/media', { ...config, params });
  return response.data;
};

export const uploadMedia = async (file: File, alt = '', folder = 'quanbao'): Promise<MediaEnvelope> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('alt', alt);
  formData.append('folder', folder);

  const response = await api.post<MediaEnvelope>('/admin/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateMedia = async (id: string, alt: string): Promise<MediaItem> => {
  const response = await apiRequest.put<MediaEnvelope>(`/admin/media/${id}`, { alt });
  return response.data.media;
};

export const deleteMedia = async (id: string): Promise<{ message: string }> => {
  const response = await apiRequest.delete<{ message: string }>(`/admin/media/${id}`);
  return response.data;
};
