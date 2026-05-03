"use client";

import type { PointerEvent } from "react";
import type { GoalTrophy } from "@/lib/types";

function updateTrophyTilt(event: PointerEvent<HTMLDivElement>) {
  const target = event.currentTarget;
  const bounds = target.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  const rotateY = ((x / bounds.width) - 0.5) * 20;
  const rotateX = (0.5 - (y / bounds.height)) * 18;

  target.style.setProperty("--trophy-rotate-x", `${rotateX.toFixed(2)}deg`);
  target.style.setProperty("--trophy-rotate-y", `${rotateY.toFixed(2)}deg`);
}

function resetTrophyTilt(event: PointerEvent<HTMLDivElement>) {
  const target = event.currentTarget;
  target.style.setProperty("--trophy-rotate-x", "0deg");
  target.style.setProperty("--trophy-rotate-y", "0deg");
}

export function TrophyCard({ trophy }: { trophy: GoalTrophy }) {
  return (
    <div
      className="trophy-card rounded-[1.6rem] border border-[#e6d39a] bg-[linear-gradient(145deg,#fff7dc_0%,#f6e6a8_100%)] px-4 py-4 shadow-[0_16px_30px_rgba(145,112,23,0.12)]"
      onPointerMove={updateTrophyTilt}
      onPointerLeave={resetTrophyTilt}
    >
      <div className="flex items-start gap-4">
        <div className="trophy-scene mt-1 shrink-0">
          <div className="trophy-3d">
            <svg viewBox="0 0 120 150" className="trophy-svg" aria-hidden="true">
              <defs>
                <linearGradient id="cupGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff8c8" />
                  <stop offset="32%" stopColor="#f4d056" />
                  <stop offset="68%" stopColor="#d9a11a" />
                  <stop offset="100%" stopColor="#99630a" />
                </linearGradient>
                <linearGradient id="rimGold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fffbe0" />
                  <stop offset="100%" stopColor="#e1b53a" />
                </linearGradient>
                <linearGradient id="baseDark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7b4c20" />
                  <stop offset="100%" stopColor="#341b0c" />
                </linearGradient>
                <filter id="trophyShadow" x="-20%" y="-20%" width="140%" height="160%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="rgba(88,54,8,0.25)" />
                </filter>
              </defs>

              <g filter="url(#trophyShadow)">
                <ellipse cx="60" cy="19" rx="26" ry="8" fill="url(#rimGold)" />
                <path
                  d="M38 20h44c-2 20-7 34-22 41C45 54 40 40 38 20Z"
                  fill="url(#cupGold)"
                />
                <path
                  d="M38 23c3 17 8 28 22 35 14-7 19-18 22-35"
                  fill="none"
                  stroke="rgba(255,250,214,0.62)"
                  strokeWidth="2.8"
                />
                <path
                  d="M33 24c-12 0-18 6-18 15 0 9 7 16 22 17"
                  fill="none"
                  stroke="#d5a223"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M87 24c12 0 18 6 18 15 0 9-7 16-22 17"
                  fill="none"
                  stroke="#d5a223"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <rect x="54" y="60" width="12" height="19" rx="6" fill="url(#cupGold)" />
                <rect x="43" y="77" width="34" height="10" rx="5" fill="url(#cupGold)" />
                <rect x="36" y="87" width="48" height="19" rx="8" fill="url(#baseDark)" />
                <path
                  d="M60 30l4.8 9.8 10.8 1.6-7.8 7.6 1.8 10.8L60 54.6l-9.6 5.2 1.8-10.8-7.8-7.6 10.8-1.6Z"
                  fill="#fff7d0"
                  opacity="0.9"
                />
              </g>

              <circle cx="88" cy="26" r="3.5" fill="#fff8d1" opacity="0.9" />
              <circle cx="93" cy="19" r="2" fill="#fff8d1" opacity="0.8" />
              <circle cx="28" cy="31" r="2.5" fill="#fff8d1" opacity="0.75" />
            </svg>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8b6414]">
            Awarded {trophy.awardedLabel}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#4f3610]">{trophy.title}</p>
          <p className="mt-2 text-sm leading-6 text-[#6d5321]">{trophy.summary}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[#977326]">
            Inspired by a CC0 trophy artwork from Wikimedia/OpenClipart
          </p>
        </div>
      </div>
    </div>
  );
}
