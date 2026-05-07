"use client";

import Script from "next/script";
import { useId, useState, type FormEvent } from "react";

declare global {
  interface Window {
    puter?: {
      auth?: {
        isSignedIn: () => boolean;
        signIn: (options?: Record<string, unknown>) => Promise<unknown>;
      };
      ai?: {
        txt2img: (
          prompt: string,
          options?: boolean | Record<string, unknown>,
        ) => Promise<HTMLImageElement | string>;
      };
    };
  }
}

const SCRIPT_SRC = "https://js.puter.com/v2/";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error) {
    return error;
  }

  if (error && typeof error === "object") {
    const candidate = error as {
      message?: unknown;
      error?: unknown;
      code?: unknown;
      status?: unknown;
    };
    const message =
      typeof candidate.message === "string"
        ? candidate.message
        : typeof candidate.error === "string"
          ? candidate.error
          : null;

    if (message) {
      const details = [candidate.status, candidate.code].filter(Boolean).join(" / ");
      return details ? `${message} (${details})` : message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return "Image generation failed. Check your Puter session and try again.";
    }
  }

  return "Image generation failed. Check your Puter session and try again.";
}

export function CaptureImageGenerator() {
  const promptId = useId();
  const [prompt, setPrompt] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [useTestMode, setUseTestMode] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  function refreshSignInState() {
    setIsSignedIn(Boolean(window.puter?.auth?.isSignedIn?.()));
  }

  async function handleSignIn() {
    if (!window.puter?.auth?.signIn) {
      setErrorMessage("Puter auth is not ready yet.");
      return;
    }

    setIsSigningIn(true);
    setErrorMessage("");

    try {
      await window.puter.auth.signIn({
        attempt_temp_user_creation: true,
      });
      refreshSignInState();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setErrorMessage("Write a prompt first.");
      return;
    }

    if (!window.puter?.ai?.txt2img) {
      setErrorMessage("Puter.js is still loading. Try again in a moment.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");

    try {
      const result = await window.puter.ai.txt2img(trimmedPrompt, {
        test_mode: useTestMode,
      });
      const nextImageSrc = typeof result === "string" ? result : result.src;

      if (!nextImageSrc) {
        throw new Error("Puter did not return an image.");
      }

      setImageSrc(nextImageSrc);
      refreshSignInState();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="panel ai-panel rounded-[1.75rem] p-5 sm:p-6">
      <Script
        src={SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={() => {
          setScriptReady(true);
          refreshSignInState();
        }}
        onError={() => setErrorMessage("Could not load Puter.js. Check your connection and try again.")}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-ink-soft">AI image prompt</p>
          <h2 className="display mt-2 text-3xl">Sketch the idea before you organize it</h2>
        </div>
        <div className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.16em] text-ink-soft">
          {scriptReady ? "Puter ready" : "Loading Puter"}
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
        Generate a rough visual from a text prompt directly in the browser. Puter may ask the
        user to sign in because image costs are handled through the user&apos;s Puter account.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.16em] text-ink-soft">
          {isSignedIn ? "Signed in to Puter" : "Not signed in to Puter"}
        </div>
        <button
          type="button"
          onClick={handleSignIn}
          disabled={!scriptReady || isSigningIn}
          className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong disabled:opacity-60"
        >
          {isSigningIn ? "Signing in..." : "Sign in to Puter"}
        </button>
      </div>

      <form onSubmit={handleGenerate} className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.92fr]">
        <div className="rounded-[1.5rem] border border-border bg-surface-strong p-4">
          <label htmlFor={promptId} className="text-sm font-semibold text-foreground">
            Prompt
          </label>
          <textarea
            id={promptId}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={6}
            placeholder="Example: warm corner coffee kiosk with brass details, soft morning light, product mockup style"
            className="mt-3 min-h-36 w-full rounded-[1.25rem] border border-border bg-white/70 px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft focus:border-accent"
          />
          <label className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={useTestMode}
              onChange={(event) => setUseTestMode(event.target.checked)}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            Use Puter test mode first
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isGenerating || !scriptReady}
              className="inline-flex rounded-full bg-[#201914] px-5 py-2.5 text-sm font-semibold text-[#fff7ef] transition hover:bg-[#352820] disabled:opacity-60"
            >
              {isGenerating ? "Generating..." : "Generate image"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPrompt("");
                setImageSrc(null);
                setErrorMessage("");
              }}
              className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
            >
              Clear
            </button>
          </div>
          <p className="mt-3 min-h-5 text-sm text-[#8f2f23]">{errorMessage}</p>
          <p className="text-xs leading-6 text-ink-soft">
            If test mode works but normal mode fails, the issue is likely Puter account auth,
            credits, or provider-side validation rather than this UI.
          </p>
        </div>

        <div className="capture-image-stage rounded-[1.5rem] border border-border bg-[rgba(32,25,20,0.04)] p-4">
          {imageSrc ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[1.25rem] border border-border bg-white shadow-[0_18px_45px_rgba(43,25,14,0.12)]">
                {/* Puter returns a runtime-hosted URL, so Next image optimization is not configured here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={prompt || "AI generated preview"}
                  className="block h-auto w-full"
                />
              </div>
              <a
                href={imageSrc}
                download="capture-image.png"
                className="inline-flex rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
              >
                Download image
              </a>
            </div>
          ) : (
            <div className="capture-image-placeholder flex min-h-[20rem] flex-col justify-between rounded-[1.25rem] border border-dashed border-border px-5 py-5 text-sm text-ink-soft">
              <p>
                Generated images will appear here. Use this to mock up packaging, menu shots,
                storefront ideas, or visual notes before you turn them into structured tasks.
              </p>
              <div className="grid gap-2 text-xs uppercase tracking-[0.16em] text-[#8a705d]">
                <p>Product scene</p>
                <p>Social promo concept</p>
                <p>Store layout idea</p>
              </div>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
