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

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 px-4 pb-4 md:hidden">
      <div className="panel mx-auto grid max-w-xl grid-cols-5 gap-2 rounded-[1.75rem] px-2 py-2">
        {navigation.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-2xl px-2 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition ${
                isActive
                  ? "bg-accent text-white shadow-[0_10px_24px_rgba(157,67,34,0.28)]"
                  : "text-ink-soft hover:bg-surface-strong hover:text-accent-strong"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
