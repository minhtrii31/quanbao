import { DEFAULT_SITE_SETTINGS } from "@/lib/constants";
import { getSettings } from "@/lib/api/settings";
import { SiteSettings } from "@/types/api";

export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    return await getSettings();
  } catch {
    return {
      company: { ...DEFAULT_SITE_SETTINGS.company },
      social: { ...DEFAULT_SITE_SETTINGS.social },
      seo: { ...DEFAULT_SITE_SETTINGS.seo },
    };
  }
};
