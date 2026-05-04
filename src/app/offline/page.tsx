export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="panel w-full max-w-xl rounded-[2rem] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Offline</p>
        <h1 className="display mt-2 text-4xl">You are offline</h1>
        <p className="mt-4 text-base leading-7 text-ink-soft">
          winos needs a connection to sync your account data. Reconnect and reopen the app to continue.
        </p>
      </section>
    </main>
  );
}
