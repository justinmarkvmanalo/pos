import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/goals", label: "Goals" },
  { href: "/habits", label: "Habits" },
  { href: "/capture", label: "Capture" },
  { href: "/review", label: "Review" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
      <header className="panel sticky top-4 z-10 rounded-[1.75rem] px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-ink-soft">Life OS</p>
            <p className="display mt-1 text-2xl">Personal Command Center</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 py-6">{children}</main>
    </div>
  );
}
