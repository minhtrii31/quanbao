import { apiRequest } from './index';
import { SiteSettings } from '@/types/api';

type SettingsEnvelope = {
  success: boolean;
  settings: SiteSettings;
  message?: string;
};

export const getSettings = async (): Promise<SiteSettings> => {
  const response = await apiRequest.get<SettingsEnvelope>('/settings');
  return response.data.settings;
};

export const getAdminSettings = async (): Promise<SiteSettings> => {
  const response = await apiRequest.get<SettingsEnvelope>('/admin/settings');
  return response.data.settings;
};

export const updateAdminSettings = async (settings: SiteSettings): Promise<SiteSettings> => {
  const response = await apiRequest.put<SettingsEnvelope>('/admin/settings', settings);
  return response.data.settings;
};
