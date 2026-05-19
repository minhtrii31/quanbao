// News Types
export interface News {
  _id: string;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  content: string | object;
  date: string;
  slug: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse {
  news: News[];
  totalPages: number;
  currentPage: number;
  total: number;
  limit?: number;
  counts?: {
    all: number;
    published: number;
    draft: number;
  };
}

export interface NewsParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: 'draft' | 'published' | '';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Project Types
export interface Project {
  _id: string;
  slug?: string;
  title: string;
  category: string;
  image: string;
  description: string;
  content?: string | object;
  link?: string;
  status: 'draft' | 'published';
  featured: boolean;
  startDate?: string;
  endDate?: string;
  client?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  company: {
    name: string;
    tagline: string;
    address: string;
    phone: string;
    phoneRaw: string;
    email: string;
    workingHours: string;
  };
  social: {
    facebook: string;
    zalo: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
}

export interface ProjectParams {
  id?: string;
  page?: number;
  limit?: number;
  category?: string;
  status?: 'draft' | 'published' | '';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
  total: number;
  limit?: number;
  counts?: {
    all: number;
    published: number;
    draft: number;
    categories: number;
  };
}

// Contact Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export interface ContactParams {
  page?: number;
  limit?: number;
  status?: Contact['status'] | '';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ContactResponse {
  contacts: Contact[];
  totalPages: number;
  currentPage: number;
  total: number;
  limit?: number;
}

// User Types
export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user: User;
}

export interface Service {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  detail: string;
  features: string[];
  includes: string[];
  process: string[];
  image: string;
  status: 'draft' | 'published';
  order: number;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaItem {
  _id: string;
  url: string;
  publicId: string;
  alt: string;
  folder: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaParams {
  page?: number;
  limit?: number;
  folder?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MediaResponse {
  media: MediaItem[];
  totalPages: number;
  currentPage: number;
  total: number;
  limit?: number;
}

export interface UploadResponse {
  success: boolean;
  url: string;
  public_id: string;
  message: string;
}

// Stats Types
export interface StatsResponse {
  success: boolean;
  news: number;
  projects: number;
  contacts: number;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Error Types
export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}
