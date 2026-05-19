import { apiRequest } from './index';
import { ApiResponse, Project, ProjectParams, ProjectResponse } from '@/types/api';

type ProjectEnvelope = ApiResponse<Project> & { project: Project };
type ProjectListEnvelope = ApiResponse<Project[]> & ProjectResponse;

// Get all published projects
export const getProjects = async (params?: Pick<ProjectParams, 'page' | 'limit' | 'category'>): Promise<Project[]> => {
  const response = await apiRequest.get<ProjectListEnvelope>('/projects', {
    params,
    skipAuthRedirect: true,
  });
  return response.data.projects;
};

// Get paginated published projects
export const getProjectPage = async (params?: Pick<ProjectParams, 'page' | 'limit' | 'category'>): Promise<ProjectResponse> => {
  const response = await apiRequest.get<ProjectListEnvelope>('/projects', {
    params,
    skipAuthRedirect: true,
  });
  return response.data;
};

// Get single project by slug, with legacy ID fallback
export const getProject = async (identifier: string): Promise<Project> => {
  const response = await apiRequest.get<ProjectEnvelope>(`/projects/${identifier}`, {
    skipAuthRedirect: true,
  });
  return response.data.project;
};

// Admin: Get all projects (including drafts)
export const getAllProjects = async (params?: ProjectParams): Promise<ProjectResponse> => {
  const response = await apiRequest.get<ProjectListEnvelope>('/admin/projects', { params });
  return response.data;
};

// Admin: Get single project by ID
export const getAdminProject = async (id: string): Promise<Project> => {
  const response = await apiRequest.get<ProjectEnvelope>(`/admin/projects/${id}`);
  return response.data.project;
};

// Admin: Create project
export const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  const response = await apiRequest.post<ProjectEnvelope>('/admin/projects', projectData);
  return response.data.project;
};

// Admin: Update project
export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
  const response = await apiRequest.put<ProjectEnvelope>(`/admin/projects/${id}`, projectData);
  return response.data.project;
};

// Admin: Delete project
export const deleteProject = async (id: string): Promise<{ message: string }> => {
  const response = await apiRequest.delete<{ message: string }>(`/admin/projects/${id}`);
  return response.data;
};
