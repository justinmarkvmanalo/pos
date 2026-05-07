"use client";

import { useState } from "react";
import { CollapsiblePanel } from "@/components/collapsible-panel";
import { GoalExampleForm } from "@/components/goal-example-form";
import { GoalForm } from "@/components/goal-form";

type GoalExampleGroup = {
  category: string;
  examples: {
    title: string;
    ownerNote: string;
    starterMilestones: string[];
  }[];
};

export function GoalCreateControls({ goalExampleGroups }: { goalExampleGroups: GoalExampleGroup[] }) {
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-start gap-3">
        <button
          type="button"
          onClick={() => setIsGoalFormOpen((current) => !current)}
          className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
        >
          {isGoalFormOpen ? "Close" : "Add goal"}
        </button>
        <button
          type="button"
          onClick={() => setIsLibraryOpen((current) => !current)}
          className="rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
        >
          {isLibraryOpen ? "Hide Goal idea library" : "Show Goal idea library"}
        </button>
      </div>

      <GoalForm
        className="mt-0"
        panelClassName="mt-4 rounded-[1.5rem] border border-border bg-surface-strong p-4"
        open={isGoalFormOpen}
        onOpenChange={setIsGoalFormOpen}
        hideTrigger
      />

      <CollapsiblePanel
        buttonLabel="Goal idea library"
        title="Goal idea library"
        description="Use an example goal, then adjust the milestones later."
        className="mt-4 rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-4"
        open={isLibraryOpen}
        onOpenChange={setIsLibraryOpen}
        hideTrigger
      >
        <div className="mt-4 grid gap-4">
          {goalExampleGroups.map((group) => (
            <div key={group.category}>
              <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">{group.category}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {group.examples.map((example) => (
                  <GoalExampleForm
                    key={example.title}
                    title={example.title}
                    ownerNote={example.ownerNote}
                    starterMilestones={example.starterMilestones}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsiblePanel>
    </div>
  );
}
