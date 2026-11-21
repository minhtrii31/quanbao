"use client";

import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { submitContact } from "@/lib/api/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatusMessage(null);
  };

  const validateForm = () => {
    const nextErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) nextErrors.name = "Vui lòng nhập họ tên.";
    if (!formData.email.trim()) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = "Email không đúng định dạng.";
    }
    if (!formData.subject.trim()) nextErrors.subject = "Vui lòng nhập chủ đề.";
    if (!formData.message.trim())
      nextErrors.message = "Vui lòng nhập nội dung.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setFormData(initialFormData);
      setStatusMessage("Cảm ơn bạn. Quân Bảo đã nhận thông tin liên hệ.");
      toast.success("Gửi liên hệ thành công");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setStatusMessage(
        axiosError.response?.data?.message ||
          "Không thể gửi liên hệ lúc này. Vui lòng thử lại sau.",
      );
      toast.error("Gửi liên hệ thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-border bg-white p-6 shadow-[0_12px_50px_-25px_#4c3b2920] sm:p-8 lg:p-10"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
          Gửi yêu cầu tư vấn
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Cho chúng tôi biết hạng mục, địa điểm và nhu cầu của bạn.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Họ tên</Label>
          <Input
            id="contact-name"
            autoComplete="name"
            placeholder="Họ và tên của bạn"
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            className="min-h-12 rounded-sm border-border bg-muted/40 px-4 shadow-none"
          />
          {errors.name && (
            <p id="contact-name-error" className="text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            autoComplete="email"
            placeholder="ban@example.com"
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            className="min-h-12 rounded-sm border-border bg-muted/40 px-4 shadow-none"
          />
          {errors.email && (
            <p id="contact-email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone">Điện thoại</Label>
          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder="Số điện thoại liên hệ"
            value={formData.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="min-h-12 rounded-sm border-border bg-muted/40 px-4 shadow-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-subject">Chủ đề</Label>
          <Input
            id="contact-subject"
            placeholder="Bạn cần tư vấn về..."
            aria-describedby={
              errors.subject ? "contact-subject-error" : undefined
            }
            value={formData.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            aria-invalid={Boolean(errors.subject)}
            className="min-h-12 rounded-sm border-border bg-muted/40 px-4 shadow-none"
          />
          {errors.subject && (
            <p id="contact-subject-error" className="text-xs text-destructive">
              {errors.subject}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-message">Nội dung</Label>
          <Textarea
            id="contact-message"
            placeholder="Chia sẻ nhu cầu, quy mô hoặc ý tưởng công trình của bạn..."
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            value={formData.message}
            onChange={(event) => updateField("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            rows={6}
            className="min-h-12 rounded-sm border-border bg-muted/40 px-4 shadow-none"
          />
          {errors.message && (
            <p id="contact-message-error" className="text-xs text-destructive">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {statusMessage && (
        <p
          role="status"
          aria-live="polite"
          className="mt-5 border-l-2 border-primary bg-muted/60 p-4 text-sm leading-7"
        >
          {statusMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-7 h-12 w-full rounded-sm text-sm"
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        Gửi liên hệ
      </Button>
    </form>
  );
}
