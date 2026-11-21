"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loading: authLoading, login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [authLoading, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user?.role === "admin") {
    return <div className="min-h-svh bg-background" />;
  }

  return (
    <main className="grid min-h-svh bg-white lg:grid-cols-2">
      <div className="relative hidden flex-col overflow-hidden bg-[#fff6ec] p-12 lg:flex xl:p-16">
        <Link
          href="/"
          aria-label="Quân Bảo — Trang chủ"
          className="relative z-10 w-fit"
        >
          <Image
            src="/assets/logo.png"
            alt="Quân Bảo"
            width={2001}
            height={761}
            sizes="190px"
            priority
            className="h-auto w-[190px] mix-blend-multiply"
          />
        </Link>
        <div className="relative z-10 mb-10 mt-14">
          <span className="eyebrow mb-6">Quân Bảo Construction</span>
          <h2 className="section-title max-w-lg">
            Quản lý nội dung
            <br />
            <span className="text-primary">website Quân Bảo.</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
            Dự án, dịch vụ, tin tức và thông tin liên hệ.
          </p>
        </div>
        <div className="image-frame relative min-h-72 flex-1">
          <Image
            src="/assets/home/3.avif"
            alt="Không gian kiến trúc hiện đại"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          <div className="absolute bottom-6 left-6 flex items-center gap-3 text-xs text-white">
            <span className="size-1.5 rounded-full bg-white" />
            Uy tín vững chắc — Xây dựng đẳng cấp
          </div>
          <ArrowUpRight className="absolute bottom-5 right-5 size-8 stroke-1 text-white" />
        </div>
      </div>
      <div className="relative flex min-w-0 items-center justify-center px-6 py-24 sm:px-12">
        <Link
          href="/"
          className="absolute left-6 top-8 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary sm:left-12"
        >
          <ArrowLeft className="size-3.5" />
          Về trang chủ
        </Link>
        <div className="w-full max-w-[380px]">
          <Image
            src="/assets/logo.png"
            alt="Quân Bảo"
            width={2001}
            height={761}
            sizes="160px"
            className="mb-10 h-auto w-40 lg:hidden"
          />
          <span className="mb-6 inline-flex size-12 items-center justify-center rounded-sm border border-primary/15 bg-primary/7">
            <ShieldCheck className="size-6 stroke-[1.4] text-primary" />
          </span>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Quản trị website
          </p>
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Đăng nhập
          </h1>
          <p className="mb-9 mt-4 text-sm leading-7 text-muted-foreground">
            Đăng nhập để quản lý nội dung và các hoạt động trên website Quân
            Bảo.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="Email quản trị của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12 rounded-sm bg-muted/40 px-4 shadow-none"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 rounded-sm bg-muted/40 pl-4 pr-12 shadow-none"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div
                role="alert"
                className="border-l-2 border-destructive bg-destructive/5 p-4 text-sm leading-6 text-destructive"
              >
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="h-12 w-full justify-between rounded-sm px-5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>Đang đăng nhập...</span>
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowUpRight className="size-4" />
                </>
              )}
            </Button>
          </form>
          <p className="mt-8 text-center text-[11px] leading-6 text-muted-foreground">
            Khu vực dành riêng cho quản trị viên được cấp quyền.
          </p>
        </div>
      </div>
    </main>
  );
}
