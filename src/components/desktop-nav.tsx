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
    <nav data-tour="navigation" className="hidden flex-wrap gap-2 md:flex">
      {navigation.filter((item) => item.href !== "/profile").map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-accent bg-accent text-white shadow-[0_10px_24px_rgba(157,67,34,0.28)]"
                : "border-border bg-[rgba(255,251,245,0.88)] text-ink-soft hover:border-accent hover:text-accent-strong"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
