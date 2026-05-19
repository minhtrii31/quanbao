import { apiRequest } from './index';
import { ApiResponse, Contact, ContactParams, ContactResponse, StatsResponse } from '@/types/api';

type ContactListEnvelope = ApiResponse<Contact[]> & ContactResponse;
type ContactEnvelope = ApiResponse<Contact> & { contact: Contact };

// Admin: Get all contacts
export const getContacts = async (params?: ContactParams): Promise<ContactResponse> => {
  const response = await apiRequest.get<ContactListEnvelope>('/admin/contacts', { params });
  return response.data;
};

// Admin: Update contact status
export const updateContact = async (id: string, status: string): Promise<Contact> => {
  const response = await apiRequest.put<ContactEnvelope>(`/admin/contacts/${id}`, { status });
  return response.data.contact;
};

// Admin: Delete contact
export const deleteContact = async (id: string): Promise<{ message: string }> => {
  const response = await apiRequest.delete<{ message: string }>(`/admin/contacts/${id}`);
  return response.data;
};

// Admin: Get dashboard statistics
export const getStats = async (): Promise<StatsResponse> => {
  const response = await apiRequest.get<StatsResponse>('/stats');
  return response.data;
};
