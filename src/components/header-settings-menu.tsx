"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { NavIcon } from "@/components/nav-icon";

export function HeaderSettingsMenu({
  userName,
  userEmail,
  avatarUrl,
  compact = false,
}: {
  userName: string;
  userEmail: string;
  avatarUrl: string;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const initials = (userName || userEmail || "A").slice(0, 1).toUpperCase();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function openGuide() {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("winos:open-guide"));

    const url = new URL(window.location.href);
    url.searchParams.set("guide", "1");
    router.push(`${pathname}?${url.searchParams.toString()}`);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        data-tour="settings"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`inline-flex items-center gap-3 rounded-full border border-border bg-[rgba(255,251,245,0.88)] transition hover:border-accent hover:text-accent-strong ${
          compact ? "px-3 py-2" : "px-3 py-2.5 text-sm font-medium text-ink-soft"
        }`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-white/80">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="profile picture" className="h-8 w-8 rounded-xl object-cover" />
          ) : (
            <span className="text-xs font-semibold text-ink-soft">{initials}</span>
          )}
        </span>
        {compact ? null : (
          <span className="hidden min-w-0 text-left lg:block">
            <span className="block max-w-[10rem] truncate text-sm font-medium">{userName || "Settings"}</span>
            <span className="block max-w-[12rem] truncate text-xs text-ink-soft">{userEmail}</span>
          </span>
        )}
        <NavIcon icon="settings" className="h-4 w-4" />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-60 rounded-[1.5rem] border border-border bg-[rgba(255,251,245,0.98)] p-2 shadow-[0_24px_60px_rgba(56,29,11,0.16)] backdrop-blur-xl"
        >
          <button
            type="button"
            onClick={openGuide}
            className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-left text-sm text-foreground transition hover:bg-[#fff4e8]"
          >
            <NavIcon icon="spark" className="h-4 w-4 text-accent-strong" />
            <span>Replay guide</span>
          </button>
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm text-foreground transition hover:bg-[#fff4e8]"
          >
            <NavIcon icon="profile" className="h-4 w-4 text-ink-soft" />
            <span>Profile</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-left text-sm text-foreground transition hover:bg-[#fff4e8]"
            >
              <NavIcon icon="logout" className="h-4 w-4 text-ink-soft" />
              <span>Log out</span>
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
