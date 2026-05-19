import type { MetadataRoute } from "next";
import { getNews } from "@/lib/api/news";
import { getProjectPage } from "@/lib/api/projects";
import { getServices } from "@/lib/api/services";
import { getSiteUrl } from "@/lib/site-url";
import type { News, NewsResponse, Project, ProjectResponse, Service } from "@/types/api";

const NEWS_BATCH_SIZE = 100;
const PROJECT_BATCH_SIZE = 24;
// A single sitemap file should stay under the search-engine protocol limit.
// If the site approaches this limit, split by route group with generateSitemaps().
const SITEMAP_URL_LIMIT = 50000;

type DynamicSitemapEntry = MetadataRoute.Sitemap[number];
type PaginatedSitemapResponse<T> = {
  items: T[];
  totalPages: number;
  total: number;
};

const formatSitemapError = (error: unknown): string => {
  if (error instanceof Error) {
    const details = error as Error & { code?: string; response?: { status?: number } };
    const status = details.response?.status ? `status=${details.response.status}` : null;
    const code = details.code ? `code=${details.code}` : null;
    return [details.message, status, code].filter(Boolean).join(" ");
  }

  return String(error);
};

const logSitemapError = (message: string, error: unknown) => {
  console.error(`[sitemap] ${message}: ${formatSitemapError(error)}`);
};

const warnSitemap = (message: string) => {
  console.warn(`[sitemap] ${message}`);
};

const normalizeTotalPages = (value: unknown): number => {
  const totalPages = Number(value);
  return Number.isFinite(totalPages) && totalPages > 0 ? Math.ceil(totalPages) : 1;
};

const collectPaginatedItems = async <T>({
  label,
  batchSize,
  fetchPage,
}: {
  label: string;
  batchSize: number;
  fetchPage: (page: number) => Promise<PaginatedSitemapResponse<T>>;
}): Promise<T[]> => {
  const items: T[] = [];
  let expectedTotal = 0;
  let expectedTotalPages = 1;

  for (let page = 1; page <= expectedTotalPages; page += 1) {
    try {
      const response = await fetchPage(page);
      const pageItems = response.items;
      const totalPages = normalizeTotalPages(response.totalPages);
      expectedTotalPages = totalPages;
      expectedTotal = response.total;
      items.push(...pageItems);

      if (pageItems.length === 0 && page <= totalPages && response.total > items.length) {
        warnSitemap(`${label} page ${page} returned no items before the reported total was reached`);
      }

      if (page >= totalPages) break;
      if (pageItems.length < batchSize) {
        warnSitemap(`${label} page ${page} returned fewer than ${batchSize} items before totalPages=${totalPages}`);
        break;
      }
    } catch (error) {
      logSitemapError(`${label} page ${page} failed; keeping ${items.length} ${label} URLs already fetched`, error);
      return items;
    }
  }

  if (expectedTotal > items.length) {
    warnSitemap(`${label} sitemap fetched ${items.length} of ${expectedTotal} reported items`);
  }

  return items;
};

const collectNews = () =>
  collectPaginatedItems<News>({
    label: "news",
    batchSize: NEWS_BATCH_SIZE,
    fetchPage: async (page) => {
      const response: NewsResponse = await getNews({ page, limit: NEWS_BATCH_SIZE });
      return {
        items: response.news,
        totalPages: response.totalPages,
        total: response.total,
      };
    },
  });

const collectProjects = () =>
  collectPaginatedItems<Project>({
    label: "projects",
    batchSize: PROJECT_BATCH_SIZE,
    fetchPage: async (page) => {
      const response: ProjectResponse = await getProjectPage({ page, limit: PROJECT_BATCH_SIZE });
      return {
        items: response.projects,
        totalPages: response.totalPages,
        total: response.total,
      };
    },
  });

const collectServices = async (): Promise<Service[]> => {
  try {
    return await getServices();
  } catch (error) {
    logSitemapError("services fetch failed; omitting service URLs", error);
    return [];
  }
};

const appendEntriesWithinLimit = (
  sitemapEntries: DynamicSitemapEntry[],
  dynamicEntries: DynamicSitemapEntry[],
  label: string,
) => {
  const remainingSlots = SITEMAP_URL_LIMIT - sitemapEntries.length;
  if (remainingSlots <= 0) {
    warnSitemap(`${label} URLs omitted because the single sitemap reached ${SITEMAP_URL_LIMIT} URLs`);
    return sitemapEntries;
  }

  if (dynamicEntries.length > remainingSlots) {
    warnSitemap(
      `${label} URLs truncated from ${dynamicEntries.length} to ${remainingSlots}; split sitemap generation before adding more dynamic URLs`,
    );
  }

  return [...sitemapEntries, ...dynamicEntries.slice(0, remainingSlots)];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const staticRoutes = ["", "/about", "/prices", "/projects", "/news", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));

  const [news, projects, services] = await Promise.all([
    collectNews(),
    collectProjects(),
    collectServices(),
  ]);

  const newsEntries = news.flatMap((item) => {
    if (!item.slug) {
      warnSitemap(`news item ${item._id} has no slug and cannot be included`);
      return [];
    }

    return [{
      url: `${siteUrl}/news/${item.slug}`,
      lastModified: new Date(item.updatedAt || item.date),
    }];
  });

  const projectEntries = projects.map((item) => ({
    url: `${siteUrl}/projects/${item.slug || item._id}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
  }));

  const serviceEntries = services.flatMap((item) => {
    if (!item.slug) {
      warnSitemap(`service item ${item._id || item.title} has no slug and cannot be included`);
      return [];
    }

    return [{
      url: `${siteUrl}/prices/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
    }];
  });

  return [
    { label: "news", entries: newsEntries },
    { label: "projects", entries: projectEntries },
    { label: "services", entries: serviceEntries },
  ].reduce<MetadataRoute.Sitemap>(
    (entries, section) => appendEntriesWithinLimit(entries, section.entries, section.label),
    staticRoutes,
  );
}
