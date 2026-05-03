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
            <div className="trophy-cup" />
            <div className="trophy-handle trophy-handle-left" />
            <div className="trophy-handle trophy-handle-right" />
            <div className="trophy-stem" />
            <div className="trophy-base trophy-base-top" />
            <div className="trophy-base trophy-base-bottom" />
            <div className="trophy-shine" />
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8b6414]">
            Awarded {trophy.awardedLabel}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#4f3610]">{trophy.title}</p>
          <p className="mt-2 text-sm leading-6 text-[#6d5321]">{trophy.summary}</p>
        </div>
      </div>
    </div>
  );
}
