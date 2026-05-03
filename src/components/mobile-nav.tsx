"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { navigation } from "@/components/app-navigation";
import { NavIcon } from "@/components/nav-icon";

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
      <div className="panel no-scrollbar mx-auto flex max-w-xl items-center gap-2 overflow-x-auto rounded-[1.75rem] px-2 py-2">
        {navigation.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-w-[3.25rem] shrink-0 items-center justify-center rounded-2xl px-2 py-3 transition ${
                isActive
                  ? "bg-accent text-white shadow-[0_10px_24px_rgba(157,67,34,0.28)]"
                  : "text-ink-soft hover:bg-surface-strong hover:text-accent-strong"
              }`}
            >
              <NavIcon icon={item.icon} />
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
        <form action={logoutAction} className="shrink-0">
          <button
            type="submit"
            className="flex min-w-[3.25rem] items-center justify-center rounded-2xl px-2 py-3 text-ink-soft transition hover:bg-surface-strong hover:text-accent-strong"
          >
            <NavIcon icon="logout" />
            <span className="sr-only">Log out</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
