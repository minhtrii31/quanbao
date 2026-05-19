import { apiRequest } from './index';
import { ApiResponse, News, NewsResponse, NewsParams } from '@/types/api';

type NewsEnvelope = ApiResponse<News> & { news: News };
type NewsListEnvelope = ApiResponse<News[]> & NewsResponse;

// Get all published news with pagination
export const getNews = async (params?: NewsParams): Promise<NewsResponse> => {
  const response = await apiRequest.get<NewsResponse>('/news', {
    params,
    skipAuthRedirect: true,
  });
  return response.data;
};

// Get single news by slug
export const getNewsBySlug = async (slug: string): Promise<News> => {
  const response = await apiRequest.get<NewsEnvelope>(`/news/${slug}`, {
    skipAuthRedirect: true,
  });
  return response.data.news;
};

// Admin: Get all news (including drafts)
export const getAllNews = async (params?: NewsParams): Promise<NewsResponse> => {
  const response = await apiRequest.get<NewsListEnvelope>('/admin/news', { params });
  return response.data;
};

// Admin: Get single news by ID
export const getNewsById = async (id: string): Promise<News> => {
  const response = await apiRequest.get<NewsEnvelope>(`/admin/news/${id}`);
  return response.data.news;
};

// Admin: Create news
export const createNews = async (newsData: Partial<News>): Promise<News> => {
  const response = await apiRequest.post<NewsEnvelope>('/admin/news', newsData);
  return response.data.news;
};

// Admin: Update news
export const updateNews = async (id: string, newsData: Partial<News>): Promise<News> => {
  const response = await apiRequest.put<NewsEnvelope>(`/admin/news/${id}`, newsData);
  return response.data.news;
};

// Admin: Delete news
export const deleteNews = async (id: string): Promise<{ message: string }> => {
  const response = await apiRequest.delete<{ message: string }>(`/admin/news/${id}`);
  return response.data;
};
