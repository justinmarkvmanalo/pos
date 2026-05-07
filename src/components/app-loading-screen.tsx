import { AppShell } from "@/components/app-shell";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`loading-shimmer rounded-[1.5rem] ${className}`} />;
}

export function AppLoadingScreen() {
  return (
    <AppShell>
      <section className="grid items-start gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <SkeletonBlock className="h-4 w-40 rounded-full" />
          <SkeletonBlock className="mt-5 h-14 w-full max-w-2xl" />
          <SkeletonBlock className="mt-4 h-5 w-full max-w-xl" />
          <SkeletonBlock className="mt-2 h-5 w-3/4 max-w-lg" />

          <div className="metric-grid mt-8">
            <SkeletonBlock className="h-32" />
            <SkeletonBlock className="h-32" />
            <SkeletonBlock className="h-32" />
          </div>
        </div>

        <div className="panel rounded-[2rem] p-6">
          <SkeletonBlock className="h-4 w-32 rounded-full" />
          <SkeletonBlock className="mt-4 h-10 w-44" />
          <SkeletonBlock className="mt-5 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-5/6" />
          <div className="mt-6 space-y-3">
            <SkeletonBlock className="h-14" />
            <SkeletonBlock className="h-14" />
            <SkeletonBlock className="h-14" />
          </div>
        </div>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-3">
              <SkeletonBlock className="h-4 w-28 rounded-full" />
              <SkeletonBlock className="h-10 w-56" />
            </div>
            <SkeletonBlock className="h-8 w-28 rounded-full" />
          </div>
          <div className="mt-6 space-y-4">
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-28" />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="panel rounded-[2rem] p-6">
            <SkeletonBlock className="h-4 w-28 rounded-full" />
            <SkeletonBlock className="mt-3 h-10 w-48" />
            <SkeletonBlock className="mt-6 h-32" />
          </div>

          <div className="panel rounded-[2rem] p-6">
            <SkeletonBlock className="h-4 w-28 rounded-full" />
            <SkeletonBlock className="mt-3 h-10 w-52" />
            <SkeletonBlock className="mt-5 h-24" />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
