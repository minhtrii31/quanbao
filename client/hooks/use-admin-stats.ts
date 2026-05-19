'use client';

import { useState, useEffect } from 'react';
import { StatsResponse, News, Project } from '@/types/api';
import { getStats } from '@/lib/api/admin';
import { getAllNews } from '@/lib/api/news';
import { getAllProjects } from '@/lib/api/projects';

export const useAdminStats = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recentNews, setRecentNews] = useState<News[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, newsData, projectsData] = await Promise.all([
        getStats(),
        getAllNews({ page: 1, limit: 3, sortBy: 'createdAt', sortOrder: 'desc' }),
        getAllProjects({ page: 1, limit: 3, sortBy: 'createdAt', sortOrder: 'desc' }),
      ]);

      setStats(statsData);
      setRecentNews(newsData.news);
      setRecentProjects(projectsData.projects);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    recentNews,
    recentProjects,
    loading,
    error,
    refetch: fetchData,
  };
};
