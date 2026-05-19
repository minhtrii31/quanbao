import { apiRequest } from './index';
import { ApiResponse, Service } from '@/types/api';

type ServiceEnvelope = ApiResponse<Service> & { service: Service };
type ServiceListEnvelope = ApiResponse<Service[]> & { services: Service[] };

export const getServices = async (): Promise<Service[]> => {
  const response = await apiRequest.get<ServiceListEnvelope>('/services');
  return response.data.services;
};

export const getServiceBySlug = async (slug: string): Promise<Service> => {
  const response = await apiRequest.get<ServiceEnvelope>(`/services/${slug}`);
  return response.data.service;
};

export const getAllServices = async (): Promise<Service[]> => {
  const response = await apiRequest.get<ServiceListEnvelope>('/admin/services');
  return response.data.services;
};

export const getAdminService = async (id: string): Promise<Service> => {
  const response = await apiRequest.get<ServiceEnvelope>(`/admin/services/${id}`);
  return response.data.service;
};

export const createService = async (serviceData: Partial<Service>): Promise<Service> => {
  const response = await apiRequest.post<ServiceEnvelope>('/admin/services', serviceData);
  return response.data.service;
};

export const updateService = async (id: string, serviceData: Partial<Service>): Promise<Service> => {
  const response = await apiRequest.put<ServiceEnvelope>(`/admin/services/${id}`, serviceData);
  return response.data.service;
};

export const deleteService = async (id: string): Promise<{ message: string }> => {
  const response = await apiRequest.delete<{ message: string }>(`/admin/services/${id}`);
  return response.data;
};
