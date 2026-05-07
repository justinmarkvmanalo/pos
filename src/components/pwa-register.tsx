"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PwaRegister() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (pathname?.startsWith("/capture")) {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        void Promise.all(registrations.map((registration) => registration.unregister()));
      });
      return;
    }

    void navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  }, [pathname]);

  return null;
}
