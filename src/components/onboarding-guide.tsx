"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const GUIDE_KEY = "winos-guide-complete";

const steps = [
  {
    selector: '[data-tour="navigation"]',
    title: "Move fast",
    description: "Use these tabs to jump between dashboard, goals, habits, capture, and review.",
  },
  {
    selector: '[data-tour="daily-focus"]',
    title: "Start here",
    description: "Keep today small. Add the few tasks that actually matter.",
  },
  {
    selector: '[data-tour="habit-map"]',
    title: "Log rhythm",
    description: "Track consistency here instead of guessing how the week feels.",
  },
  {
    selector: '[data-tour="capture"]',
    title: "Catch loose ideas",
    description: "Use capture for anything not ready to become a real task yet.",
  },
  {
    selector: '[data-tour="review"]',
    title: "Close the loop",
    description: "Review shows what moved, what stalled, and what to change next.",
  },
  {
    selector: '[data-tour="settings"]',
    title: "Need anything later?",
    description: "Replay this guide, open your profile, or log out from settings.",
  },
] as const;

function getVisibleElement(selector: string) {
  const matches = Array.from(document.querySelectorAll<HTMLElement>(selector));
  return matches.find((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }) ?? null;
}

export function OnboardingGuide() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const guideRequested = searchParams.get("guide") === "1";
  const step = steps[stepIndex];

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const hasCompletedGuide = window.localStorage.getItem(GUIDE_KEY) === "true";
    if (guideRequested || !hasCompletedGuide) {
      queueMicrotask(() => {
        setStepIndex(0);
        setIsOpen(true);
      });
    }
  }, [guideRequested, pathname]);

  useEffect(() => {
    function handleOpenGuide() {
      setStepIndex(0);
      setIsOpen(true);
    }

    window.addEventListener("winos:open-guide", handleOpenGuide);
    return () => {
      window.removeEventListener("winos:open-guide", handleOpenGuide);
    };
  }, []);

  useEffect(() => {
    if (!guideRequested) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("guide");
    window.history.replaceState({}, "", url);
  }, [guideRequested]);

  useEffect(() => {
    if (!isOpen || pathname !== "/") {
      return;
    }

    function syncRect() {
      const element = getVisibleElement(step.selector);
      if (!element) {
        setRect(null);
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      window.requestAnimationFrame(() => {
        setRect(element.getBoundingClientRect());
      });
    }

    syncRect();
    window.addEventListener("resize", syncRect);
    window.addEventListener("scroll", syncRect, true);

    return () => {
      window.removeEventListener("resize", syncRect);
      window.removeEventListener("scroll", syncRect, true);
    };
  }, [isOpen, pathname, step.selector]);

  const cardStyle = useMemo(() => {
    if (!rect) {
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const preferredTop = rect.bottom + 18;
    const canPlaceBelow = preferredTop + 210 < window.innerHeight;
    const top = canPlaceBelow ? preferredTop : Math.max(20, rect.top - 228);
    const left = Math.min(Math.max(20, rect.left), window.innerWidth - 340);

    return {
      left,
      top,
      transform: "none",
    };
  }, [rect]);

  if (!isOpen || pathname !== "/") {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[rgba(32,25,20,0.46)] backdrop-blur-[3px]" />

      {rect ? (
        <div
          className="absolute rounded-[2rem] border border-white/85 shadow-[0_0_0_9999px_rgba(32,25,20,0.46),0_0_0_10px_rgba(255,247,239,0.08)] transition-all duration-300"
          style={{
            left: rect.left - 10,
            top: rect.top - 10,
            width: rect.width + 20,
            height: rect.height + 20,
          }}
        />
      ) : null}

      <div
        className="pointer-events-auto absolute w-[min(20rem,calc(100vw-2rem))] rounded-[1.75rem] border border-[#f1dcc8] bg-[#fff8ef] p-5 shadow-[0_24px_60px_rgba(32,25,20,0.28)]"
        style={cardStyle}
      >
        <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <h2 className="display mt-2 text-2xl">{step.title}</h2>
        <p className="mt-3 text-sm leading-6 text-ink-soft">{step.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(GUIDE_KEY, "true");
              setIsOpen(false);
            }}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={() => setStepIndex((current) => current - 1)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
              >
                Back
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (stepIndex === steps.length - 1) {
                  window.localStorage.setItem(GUIDE_KEY, "true");
                  setIsOpen(false);
                  return;
                }

                setStepIndex((current) => current + 1);
              }}
              className="rounded-full bg-[#201914] px-4 py-2 text-sm font-semibold text-[#fff7ef] transition hover:bg-[#352820]"
            >
              {stepIndex === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
