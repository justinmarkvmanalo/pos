"use client";

import { useState } from "react";
import { CollapsiblePanel } from "@/components/collapsible-panel";
import { HabitForm } from "@/components/habit-form";
import { HabitSuggestionForm } from "@/components/habit-suggestion-form";

type HabitSuggestionGroup = {
  category: string;
  suggestions: {
    name: string;
    targetFrequency: number;
  }[];
};

export function HabitCreateControls({
  suggestionGroups,
}: {
  suggestionGroups: HabitSuggestionGroup[];
}) {
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-start gap-3">
        <button
          type="button"
          onClick={() => setIsHabitFormOpen((current) => !current)}
          className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
        >
          {isHabitFormOpen ? "Close" : "Add habit"}
        </button>
        <button
          type="button"
          onClick={() => setIsLibraryOpen((current) => !current)}
          className="rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
        >
          {isLibraryOpen ? "Hide Habit idea library" : "Show Habit idea library"}
        </button>
      </div>

      <HabitForm
        className="mt-0"
        panelClassName="mt-4 rounded-[1.5rem] border border-border bg-surface-strong p-4"
        open={isHabitFormOpen}
        onOpenChange={setIsHabitFormOpen}
        hideTrigger
      />

      <CollapsiblePanel
        buttonLabel="Habit idea library"
        title="Habit idea library"
        description="This is a large built-in list of common human habits you can add with one click."
        className="mt-4 rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-4"
        open={isLibraryOpen}
        onOpenChange={setIsLibraryOpen}
        hideTrigger
      >
        <div className="mt-4 grid gap-4">
          {suggestionGroups.map((group) => (
            <div key={group.category}>
              <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">{group.category}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {group.suggestions.map((suggestion) => (
                  <HabitSuggestionForm
                    key={suggestion.name}
                    name={suggestion.name}
                    targetFrequency={suggestion.targetFrequency}
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
