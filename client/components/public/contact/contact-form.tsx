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
    if (!formData.message.trim()) nextErrors.message = "Vui lòng nhập nội dung.";

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
    <form onSubmit={handleSubmit} className="border border-border bg-card p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Họ tên</Label>
          <Input
            id="contact-name"
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            className="rounded-none"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            className="rounded-none"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone">Điện thoại</Label>
          <Input
            id="contact-phone"
            value={formData.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="rounded-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-subject">Chủ đề</Label>
          <Input
            id="contact-subject"
            value={formData.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            aria-invalid={Boolean(errors.subject)}
            className="rounded-none"
          />
          {errors.subject && (
            <p className="text-xs text-destructive">{errors.subject}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-message">Nội dung</Label>
          <Textarea
            id="contact-message"
            value={formData.message}
            onChange={(event) => updateField("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            rows={6}
            className="rounded-none"
          />
          {errors.message && (
            <p className="text-xs text-destructive">{errors.message}</p>
          )}
        </div>
      </div>

      {statusMessage && (
        <p className="mt-4 text-sm text-muted-foreground">{statusMessage}</p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-5 rounded-none">
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
