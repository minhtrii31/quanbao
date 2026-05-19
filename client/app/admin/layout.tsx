"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, User, ChevronDown, Home } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAdminRoute } from "@/hooks/use-auth";
import { useAuth } from "@/context/auth-context";

const navigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/news", label: "Tin tức" },
  { href: "/admin/projects", label: "Dự án" },
  { href: "/admin/services", label: "Dịch vụ" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/contacts", label: "Liên hệ" },
  { href: "/admin/settings", label: "Cài đặt" },
  { href: "/admin/account", label: "Tài khoản" },
];

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`whitespace-nowrap text-sm font-medium transition-all duration-200 px-3 xl:px-4 py-2 ${
        isActive
          ? "text-primary bg-primary/10 border-b-2 border-primary"
          : "text-foreground/70 hover:text-foreground hover:bg-muted/50 focus-visible:bg-muted"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const pathname = usePathname();
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { loading, isAdmin } = useAdminRoute();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
  }, [pathname]);

  if (loading || !isAdmin) {
    return <div className="min-h-svh bg-background" />;
  }

  return (
    <div className="min-h-svh flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Top Navigation - Desktop */}
      <header className="hidden lg:block sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full min-w-0 items-center gap-4 px-4 xl:px-8">
          {/* Left: Logo */}
          <div className="shrink-0">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                <span className="text-base font-bold text-primary-foreground">
                  QB
                </span>
              </div>
              <div className="hidden xl:block">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Quân Bảo Admin
                </p>
                <p className="text-xs text-muted-foreground">
                  Quản trị hệ thống
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Nav */}
          <nav className="flex min-w-0 flex-1 justify-center gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={isActive(item.href)}
              />
            ))}
          </nav>

          {/* Right: User Actions */}
          <div className="flex shrink-0 justify-end items-center gap-2">
            <div className="relative" ref={userDropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                className="max-w-44 px-2 gap-2 hover:bg-muted/50"
                onClick={() => setUserOpen(!userOpen)}
                aria-expanded={userOpen}
                aria-label="Mở menu tài khoản"
              >
                <div className="flex h-8 w-8 items-center justify-center bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="truncate text-sm font-medium">{user?.name || "Admin"}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>

              {userOpen && (
                <div className="absolute top-12 right-0 w-48 bg-card border border-border shadow-md py-1">
                  <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <Home className="h-4 w-4" />
                    Về trang chủ
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    aria-label="Đăng xuất"
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Top Navigation - Mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-card/95 backdrop-blur-sm px-4">
        <div className="flex h-full items-center justify-between">
          {/* Left: Logo - icon only */}
          <Link href="/admin" className="flex items-center">
            <div className="flex h-9 w-9 items-center justify-center bg-gradient-to-br from-primary to-primary/80">
              <span className="text-sm font-bold text-primary-foreground">
                QB
              </span>
            </div>
          </Link>

          {/* Middle: Hamburger menu */}
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <div className="h-9 w-9" aria-hidden="true" />
        </div>

        {/* Mobile Menu - full screen height */}
        <div
          className={`absolute top-16 left-0 right-0 bg-card border-b border-border transition-all duration-300 overflow-hidden ${
            mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex h-[calc(100svh-4rem)] flex-col space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={isActive(item.href)}
              />
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Home className="h-4 w-4" />
                Về trang chủ
              </Link>
              <button
                type="button"
                onClick={logout}
                aria-label="Đăng xuất"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-w-0 flex-1 pt-4 lg:pt-0">{children}</main>
    </div>
  );
}
