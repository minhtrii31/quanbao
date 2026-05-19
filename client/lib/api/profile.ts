import { apiRequest } from './index';
import { User } from '@/types/api';

type ProfileEnvelope = {
  success: boolean;
  user: User;
  message?: string;
};

export const getProfile = async (): Promise<User> => {
  const response = await apiRequest.get<ProfileEnvelope>('/admin/profile');
  return response.data.user;
};

export const updateProfile = async (name: string): Promise<User> => {
  const response = await apiRequest.put<ProfileEnvelope>('/admin/profile', { name });
  return response.data.user;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<ProfileEnvelope> => {
  const response = await apiRequest.put<ProfileEnvelope>('/admin/profile/password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
