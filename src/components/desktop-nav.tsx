"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/components/app-navigation";

function isActivePath(currentPath: string, href: string) {
  if (href === "/") {
    return currentPath === "/";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      data-tour="navigation"
      className="hidden flex-wrap items-center gap-2 rounded-full border border-border/80 bg-white/55 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] md:flex"
    >
      {navigation.filter((item) => item.href !== "/profile").map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-deep text-white shadow-[0_12px_24px_rgba(24,34,45,0.24)]"
                : "text-ink-soft hover:bg-white/70 hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
