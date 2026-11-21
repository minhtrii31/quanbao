"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  CircleUserRound,
  Hammer,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Settings2,
  X,
} from "lucide-react";
import { useAdminRoute } from "@/hooks/use-auth";
import { useAuth } from "@/context/auth-context";

const navigation = [
  { href: "/admin", label: "Bảng điều khiển", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Dự án", icon: Building2 },
  { href: "/admin/services", label: "Dịch vụ", icon: Hammer },
  { href: "/admin/news", label: "Tin tức", icon: Newspaper },
  { href: "/admin/media", label: "Thư viện hình ảnh", icon: Images },
  { href: "/admin/contacts", label: "Liên hệ", icon: Inbox },
  { href: "/admin/settings", label: "Cài đặt website", icon: Settings2 },
  { href: "/admin/account", label: "Tài khoản", icon: CircleUserRound },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [userOpen, setUserOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const { loading, isAdmin } = useAdminRoute();
  const { user, logout } = useAuth();
  const mobileOpen = openPath === pathname;
  const currentPage =
    navigation.find((item) => item.href === pathname)?.label ||
    "Quản lý nội dung";

  useEffect(() => {
    const dismiss = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node))
        setUserOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserOpen(false);
        setOpenPath(null);
        if (mobileOpen) menuRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [mobileOpen]);

  if (loading || !isAdmin) return <div className="min-h-svh bg-muted/50" />;

  const renderLinks = () =>
    navigation.map((item, index) => {
      const active =
        item.href === "/admin"
          ? pathname === item.href
          : pathname.startsWith(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpenPath(null)}
          aria-current={active ? "page" : undefined}
          className={`flex items-center gap-3 rounded-sm border-l-[3px] px-4 py-3 text-[13px] font-medium transition-colors ${index === 6 ? "mt-6" : ""} ${active ? "border-primary bg-primary/8 text-primary" : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"}`}
        >
          <item.icon className="size-[18px] shrink-0 stroke-[1.6]" />
          {item.label}
        </Link>
      );
    });

  return (
    <div className="admin-workspace min-h-svh bg-[#f7f8f5]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border bg-white lg:flex">
        <Link
          href="/admin"
          aria-label="Quân Bảo — Quản trị"
          className="flex h-24 items-center border-b border-border px-7"
        >
          <Image
            src="/assets/logo.png"
            alt="Quân Bảo"
            width={2001}
            height={761}
            sizes="175px"
            className="h-auto w-[175px] mix-blend-multiply"
          />
        </Link>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="px-4 pb-5 pt-4 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Không gian quản trị
          </p>
          <nav aria-label="Điều hướng quản trị" className="space-y-1">
            {renderLinks()}
          </nav>
        </div>
        <div className="border-t border-border p-5">
          <Link
            href="/"
            className="flex items-center justify-between rounded-sm border border-border px-4 py-3 text-xs font-medium hover:border-primary hover:text-primary"
          >
            Xem website
            <ArrowUpRight className="size-4" />
          </Link>
          <p className="mt-4 text-center text-[10px] text-muted-foreground">
            Quân Bảo · Quản lý nội dung
          </p>
        </div>
      </aside>
      <div className="min-w-0 lg:ml-64">
        <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between gap-3 border-b border-border bg-white/95 px-5 backdrop-blur-lg lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <button
              ref={menuRef}
              type="button"
              onClick={() => setOpenPath(mobileOpen ? null : pathname)}
              aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
              aria-controls="admin-mobile-menu"
              aria-expanded={mobileOpen}
              className="flex size-10 items-center justify-center border border-border lg:hidden"
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{currentPage}</p>
              <p className="mt-1 hidden text-[11px] text-muted-foreground sm:block">
                Quân Bảo / Quản trị website
              </p>
            </div>
          </div>
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUserOpen(!userOpen)}
              aria-expanded={userOpen}
              aria-label="Mở menu tài khoản"
              className="flex items-center gap-3 rounded-sm p-1.5 transition-colors hover:bg-muted"
            >
              <span className="flex size-9 items-center justify-center rounded-full border border-primary/15 bg-primary/8 text-sm font-semibold text-primary">
                {user?.name?.trim().charAt(0).toLocaleUpperCase() || "Q"}
              </span>
              <span className="hidden max-w-36 truncate text-left text-xs font-medium sm:block">
                {user?.name || "Quản trị viên"}
                <span className="mt-1 block text-[10px] font-normal text-muted-foreground">
                  Quản trị viên
                </span>
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
            {userOpen && (
              <div className="absolute right-0 top-14 w-52 rounded-sm border border-border bg-white p-1.5 shadow-lg shadow-black/5">
                <Link
                  href="/admin/account"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-xs hover:bg-muted"
                >
                  <CircleUserRound className="size-4" />
                  Tài khoản của tôi
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-3 text-xs hover:bg-muted"
                >
                  <ArrowUpRight className="size-4" />
                  Xem website
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 border-t border-border px-3 py-3 text-left text-xs text-destructive hover:bg-muted"
                >
                  <LogOut className="size-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>
        {mobileOpen && (
          <nav
            id="admin-mobile-menu"
            aria-label="Điều hướng quản trị di động"
            className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto border-b border-border bg-white p-5 lg:hidden"
          >
            {renderLinks()}
            <Link
              href="/"
              className="mt-8 flex items-center justify-between border-t border-border px-4 py-4 text-sm"
            >
              Xem website
              <ArrowUpRight className="size-4" />
            </Link>
          </nav>
        )}
        <main className="admin-content mx-auto min-w-0 max-w-[1600px]">
          {children}
        </main>
      </div>
    </div>
  );
}
