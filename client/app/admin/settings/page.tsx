"use client";

import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/admin/form-field";
import { FormGrid } from "@/components/admin/form-grid";
import { FormSection } from "@/components/admin/form-section";
import { DEFAULT_SITE_SETTINGS } from "@/lib/constants";
import { getAdminSettings, updateAdminSettings } from "@/lib/api/settings";
import { getApiErrorMessage } from "@/lib/api";
import { SiteSettings } from "@/types/api";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    company: { ...DEFAULT_SITE_SETTINGS.company },
    social: { ...DEFAULT_SITE_SETTINGS.social },
    seo: { ...DEFAULT_SITE_SETTINGS.seo },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAdminSettings()
      .then(setSettings)
      .catch((error) => toast.error(getApiErrorMessage(error, "Không tải được cài đặt")));
  }, []);

  const update = (section: keyof SiteSettings, key: string, value: string) => {
    setSettings((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const saved = await updateAdminSettings(settings);
      setSettings(saved);
      toast.success("Đã lưu cài đặt");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không lưu được cài đặt"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-background">
      <div className="space-y-5 px-4 py-6 pt-20 sm:space-y-6 lg:px-6 lg:py-8">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold sm:text-xl">Cài đặt website</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">Thông tin công ty, mạng xã hội và SEO trang chủ</p>
          </div>
        </div>

        <Card className="min-w-0 rounded-none">
          <CardContent className="px-4 pt-0 sm:px-6">
            <form onSubmit={handleSubmit}>
              <FormGrid>
                <div className="space-y-6">
                  <FormSection title="Thông tin công ty">
                    <FormField id="name" label="Tên công ty" value={settings.company.name} onChange={(value) => update("company", "name", value)} disabled={loading} required />
                    <FormField id="tagline" label="Slogan" value={settings.company.tagline} onChange={(value) => update("company", "tagline", value)} disabled={loading} />
                    <FormField id="address" label="Địa chỉ" type="textarea" rows={3} value={settings.company.address} onChange={(value) => update("company", "address", value)} disabled={loading} />
                    <FormField id="workingHours" label="Giờ làm việc" value={settings.company.workingHours} onChange={(value) => update("company", "workingHours", value)} disabled={loading} />
                  </FormSection>
                </div>

                <div className="space-y-6">
                  <FormSection title="Liên hệ và mạng xã hội">
                    <FormField id="phone" label="Số điện thoại hiển thị" value={settings.company.phone} onChange={(value) => update("company", "phone", value)} disabled={loading} />
                    <FormField id="phoneRaw" label="Số điện thoại gọi" value={settings.company.phoneRaw} onChange={(value) => update("company", "phoneRaw", value)} disabled={loading} />
                    <FormField id="email" label="Email" value={settings.company.email} onChange={(value) => update("company", "email", value)} disabled={loading} />
                    <FormField id="facebook" label="Facebook" value={settings.social.facebook} onChange={(value) => update("social", "facebook", value)} disabled={loading} />
                    <FormField id="zalo" label="Zalo" value={settings.social.zalo} onChange={(value) => update("social", "zalo", value)} disabled={loading} />
                  </FormSection>

                  <FormSection title="SEO trang chủ">
                    <FormField id="seoTitle" label="SEO title" value={settings.seo.title} onChange={(value) => update("seo", "title", value)} disabled={loading} />
                    <FormField id="seoDescription" label="SEO description" type="textarea" rows={3} value={settings.seo.description} onChange={(value) => update("seo", "description", value)} disabled={loading} />
                    <FormField id="ogImage" label="OG image" value={settings.seo.ogImage} onChange={(value) => update("seo", "ogImage", value)} disabled={loading} />
                  </FormSection>
                </div>
              </FormGrid>

              <div className="mt-6 flex justify-stretch sm:justify-end">
                <Button type="submit" className="w-full rounded-none sm:w-auto" disabled={loading}>
                  {loading ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
