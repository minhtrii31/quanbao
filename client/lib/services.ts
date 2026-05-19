import { SERVICE_CATALOG } from "@/lib/service-catalog";
import { getServiceBySlug as getServiceBySlugApi, getServices } from "@/lib/api/services";
import { Service } from "@/types/api";

const fallbackServices: Service[] = SERVICE_CATALOG.map((service, index) => ({
  _id: service.slug,
  title: service.title,
  slug: service.slug,
  description: service.description,
  detail: service.detail,
  image: service.image,
  features: [...service.features],
  includes: [...service.includes],
  process: [...service.process],
  status: "published",
  order: index,
}));

export const getPublicServices = async (): Promise<Service[]> => {
  try {
    const services = await getServices();
    return services.length > 0 ? services : fallbackServices;
  } catch {
    return fallbackServices;
  }
};

export const getPublicServiceBySlug = async (slug: string): Promise<Service | null> => {
  try {
    return await getServiceBySlugApi(slug);
  } catch {
    return fallbackServices.find((service) => service.slug === slug) || null;
  }
};
