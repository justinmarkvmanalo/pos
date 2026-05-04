import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/actions/auth";
import { navigation } from "@/components/app-navigation";
import { MobileNav } from "@/components/mobile-nav";
import { NavIcon } from "@/components/nav-icon";
import { getOptionalUser } from "@/lib/auth";

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await getOptionalUser();
  const userName = String(user?.user_metadata?.name ?? "").trim();
  const avatarUrl = String(user?.user_metadata?.avatar_url ?? "").trim();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-5 pb-24 sm:px-6 md:pb-5 lg:px-8">
      <div className="panel-raised soft-enter sticky top-3 z-10 mb-3 rounded-[1.4rem] px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/winos-logo.png"
              alt="winos logo"
              className="h-10 w-10 rounded-2xl border border-border bg-white/80 object-cover"
              width={40}
              height={40}
              priority
            />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.28em] text-ink-soft">winos</p>
              <p className="truncate text-sm font-semibold">Personal Command Center</p>
            </div>
          </div>
          {user ? (
            avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="profile picture"
                className="h-10 w-10 rounded-2xl border border-border bg-white/80 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-white/80 text-sm font-semibold text-ink-soft">
                {(userName || user.email || "A").slice(0, 1).toUpperCase()}
              </div>
            )
          ) : null}
        </div>
      </div>
      <header className="panel-raised soft-enter sticky top-4 z-10 hidden rounded-[1.75rem] px-5 py-4 md:block">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Image
                src="/winos-logo.png"
                alt="winos logo"
                className="h-11 w-11 rounded-2xl border border-border bg-white/80 object-cover"
                width={44}
                height={44}
                priority
              />
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.28em] text-ink-soft">winos</p>
                <p className="display mt-1 text-2xl">Personal Command Center</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <nav className="hidden flex-wrap gap-2 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-border bg-[rgba(255,251,245,0.88)] px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-[rgba(255,251,245,0.88)] px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
                  >
                    <NavIcon icon="logout" className="h-4 w-4" />
                    Log out
                  </button>
                </form>
              ) : null}
            </nav>
            {user ? (
              <div className="flex max-w-full items-center gap-3 text-sm text-ink-soft">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="profile picture"
                    className="h-9 w-9 rounded-2xl border border-border bg-white/80 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-white/80 text-xs font-semibold text-ink-soft">
                    {(userName || user.email || "A").slice(0, 1).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[14rem] truncate font-medium">{userName || "Account"}</span>
                <span className="max-w-[18rem] truncate">{user.email}</span>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 py-6">{children}</main>
      <MobileNav />
    </div>
  );
}
