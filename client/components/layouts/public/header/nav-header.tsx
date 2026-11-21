"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronRight, Menu, Phone, X } from "lucide-react";
import { NAVIGATION } from "@/lib/constants";

const links = [{ href: "/", label: "Trang chủ" }, ...NAVIGATION];

export default function NavHeader({
  phone,
  phoneRaw,
}: {
  phone: string;
  phoneRaw: string;
}) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const isOpen = openPath === pathname;
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!isOpen) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        toggleRef.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenPath(null);
    };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", outside);
    };
  }, [isOpen]);

  return (
    <nav ref={navRef} aria-label="Điều hướng chính" className="relative">
      <div className="site-container flex h-20 items-center justify-between gap-6 lg:h-[92px]">
        <Link
          href="/"
          aria-label="Quân Bảo — Trang chủ"
          onClick={() => setOpenPath(null)}
          className="shrink-0"
        >
          <Image
            src="/assets/logo.png"
            alt="Quân Bảo"
            width={2001}
            height={761}
            priority
            sizes="180px"
            className="h-auto w-[150px] mix-blend-multiply sm:w-[180px]"
          />
        </Link>
        <div className="hidden h-full items-center gap-6 lg:flex xl:gap-8">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`group flex h-full items-center px-1 text-[13px] transition-colors hover:text-primary ${active ? "font-semibold text-primary" : "font-medium text-foreground/75"}`}
              >
                <span
                  className={`relative after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:transition-colors ${active ? "after:bg-primary" : "after:bg-transparent group-hover:after:bg-primary/20"}`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${phoneRaw}`}
            className="hidden items-center gap-2 text-sm font-semibold xl:flex"
          >
            <Phone className="size-4 text-primary" />
            {phone}
          </a>
          <Link
            href="/contact"
            className="brand-button hidden min-h-11 gap-4 px-5 text-xs sm:inline-flex"
          >
            Nhận tư vấn
            <ArrowUpRight className="size-4" />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            aria-label={isOpen ? "Đóng menu" : "Mở menu"}
            aria-controls="public-mobile-menu"
            aria-expanded={isOpen}
            onClick={() => setOpenPath(isOpen ? null : pathname)}
            className="flex size-11 items-center justify-center rounded-sm border border-border lg:hidden"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          id="public-mobile-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100svh-5rem)] overflow-y-auto border-y border-border bg-white p-5 shadow-xl shadow-black/5 lg:hidden"
        >
          <div className="mx-auto flex max-w-xl flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpenPath(null)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`flex items-center justify-between border-b border-l-[3px] border-b-border px-4 py-4 text-base transition-colors hover:text-primary ${isActive(link.href) ? "border-l-primary bg-primary/6 font-semibold text-primary" : "border-l-transparent font-medium text-foreground/80 hover:bg-muted/50"}`}
              >
                <span>{link.label}</span>
                <ChevronRight
                  className={`size-4 ${isActive(link.href) ? "text-primary" : "text-muted-foreground"}`}
                />
              </Link>
            ))}
            <a
              href={`tel:${phoneRaw}`}
              className="mt-6 flex items-center gap-3 text-sm font-semibold"
            >
              <Phone className="size-4 text-primary" />
              {phone}
            </a>
            <Link
              href="/contact"
              onClick={() => setOpenPath(null)}
              className="brand-button mt-5"
            >
              Trao đổi về công trình
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
