import { logHabitAction } from "@/app/actions/data";
import { SubmitButton } from "@/components/submit-button";

export function HabitLogButton({
  habitId,
  formClassName,
  buttonClassName,
}: {
  habitId: string;
  formClassName?: string;
  buttonClassName?: string;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={logHabitAction} className={formClassName ?? "mt-4"}>
      <input type="hidden" name="habit_id" value={habitId} />
      <input type="hidden" name="completed_on" value={today} />
      <SubmitButton
        idleLabel="Log today"
        pendingLabel="Logging..."
        className={
          buttonClassName ??
          "inline-flex w-fit rounded-full border border-border bg-[#fff8ef] px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent disabled:opacity-60"
        }
      />
    </form>
  );
}
