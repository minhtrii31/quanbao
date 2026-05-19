import { apiRequest } from './index';
import { ApiResponse, Contact } from '@/types/api';

type ContactEnvelope = ApiResponse<Contact> & { contact: Contact };

// Submit contact form
export const submitContact = async (contactData: Partial<Contact>): Promise<Contact> => {
  const response = await apiRequest.post<ContactEnvelope>('/contact', contactData);
  return response.data.contact;
};
