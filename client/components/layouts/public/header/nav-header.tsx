"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navigationLinks = [
  { href: "/about", label: "Giới thiệu" },
  { href: "/prices", label: "Dịch vụ" },
  { href: "/projects", label: "Dự án" },
  { href: "/news", label: "Tin tức" },
  { href: "/contact", label: "Liên hệ" },
];

export default function NavHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 z-50 flex sm:hidden items-center justify-center p-1 bg-primary"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <button
          className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors py-1 px-3"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full bg-primary shadow-lg">
            <div className="flex max-h-[calc(100svh-3rem)] flex-col gap-1 overflow-y-auto px-4 py-2 text-center">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-white font-bold text-base hover:text-white/80 transition-colors py-2 px-3 rounded-md uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <nav
        className="sticky top-0 z-50 hidden sm:flex items-center justify-center gap-1 overflow-x-auto bg-primary px-4 py-2 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="navigation"
        aria-label="Main navigation"
      >
        {navigationLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="relative group whitespace-nowrap px-2 py-1 text-sm font-bold uppercase text-white transition-colors duration-300 hover:text-white/80"
          >
            {link.label}
            <span className="absolute bottom-0.5 left-2 w-0 h-0.5 bg-white/60 group-hover:w-[calc(100%-1rem)] transition-all duration-300" />
          </Link>
        ))}
      </nav>
    </>
  );
}
