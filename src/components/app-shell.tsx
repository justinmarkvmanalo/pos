import Image from "next/image";
import type { ReactNode } from "react";
import { DesktopNav } from "@/components/desktop-nav";
import { HeaderSettingsMenu } from "@/components/header-settings-menu";
import { MobileNav } from "@/components/mobile-nav";
import { OnboardingGuide } from "@/components/onboarding-guide";
import { getOptionalUser } from "@/lib/auth";

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await getOptionalUser();
  const userName = String(user?.user_metadata?.name ?? "").trim();
  const avatarUrl = String(user?.user_metadata?.avatar_url ?? "").trim();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-5 pb-24 sm:px-6 md:pb-5 lg:px-8">
      <div className="soft-enter pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(24,34,45,0.1),transparent_58%)]" />
      <div className="nav-shell soft-enter sticky top-3 z-10 mb-3 rounded-[1.4rem] px-4 py-3 md:hidden">
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
              <p className="truncate text-sm font-semibold">Operations cockpit</p>
            </div>
          </div>
          {user ? (
            <HeaderSettingsMenu
              userName={userName || "Settings"}
              userEmail={user.email ?? ""}
              avatarUrl={avatarUrl}
              compact
            />
          ) : null}
        </div>
      </div>
      <header className="nav-shell soft-enter sticky top-4 z-10 hidden rounded-[1.75rem] px-5 py-4 md:block">
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
                <p className="display mt-1 text-2xl">Operations cockpit</p>
                <p className="mt-1 text-sm text-ink-soft">
                  Daily execution, habits, reviews, and goals in one lane.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:justify-end">
            <DesktopNav />
            {user ? (
              <HeaderSettingsMenu
                userName={userName || "Settings"}
                userEmail={user.email ?? ""}
                avatarUrl={avatarUrl}
              />
            ) : null}
          </div>
        </div>
      </header>

      <OnboardingGuide />
      <main className="flex flex-1 flex-col gap-6 py-6">{children}</main>
      <MobileNav />
    </div>
  );
}
