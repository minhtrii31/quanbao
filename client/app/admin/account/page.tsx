"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/admin/form-field";
import { FormSection } from "@/components/admin/form-section";
import { useAuth } from "@/context/auth-context";
import { changePassword, updateProfile } from "@/lib/api/profile";
import { getApiErrorMessage } from "@/lib/api";

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function AdminAccountPage() {
  const { user, checkAuth } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await updateProfile(name);
      await checkAuth();
      setMessage("Đã cập nhật hồ sơ.");
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Không cập nhật được hồ sơ."));
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!passwordRule.test(newPassword)) {
      setMessage("Mật khẩu mới cần tối thiểu 8 ký tự, có chữ thường, chữ hoa và số.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Đã đổi mật khẩu.");
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Không đổi được mật khẩu."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-background">
      <div className="space-y-5 px-4 py-6 pt-20 sm:space-y-6 lg:px-6 lg:py-8">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold sm:text-xl">Tài khoản admin</h1>
            <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {message && <p className="text-sm text-primary">{message}</p>}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <Card className="min-w-0 rounded-none">
            <CardContent className="px-4 pt-0 sm:px-6">
              <form onSubmit={saveProfile} className="space-y-6">
                <FormSection title="Hồ sơ">
                  <FormField id="name" label="Tên hiển thị" value={name} onChange={setName} disabled={loading} required />
                </FormSection>
                <Button type="submit" className="w-full rounded-none sm:w-auto" disabled={loading}>
                  Lưu hồ sơ
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="min-w-0 rounded-none">
            <CardContent className="px-4 pt-0 sm:px-6">
              <form onSubmit={savePassword} className="space-y-6">
                <FormSection title="Đổi mật khẩu">
                  <FormField id="currentPassword" label="Mật khẩu hiện tại" inputType="password" value={currentPassword} onChange={setCurrentPassword} disabled={loading} required />
                  <FormField id="newPassword" label="Mật khẩu mới" inputType="password" value={newPassword} onChange={setNewPassword} disabled={loading} required />
                  <FormField id="confirmPassword" label="Xác nhận mật khẩu" inputType="password" value={confirmPassword} onChange={setConfirmPassword} disabled={loading} required />
                </FormSection>
                <Button type="submit" className="w-full rounded-none sm:w-auto" disabled={loading}>
                  Đổi mật khẩu
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
