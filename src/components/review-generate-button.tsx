import { generateReviewAction } from "@/app/actions/data";
import { SubmitButton } from "@/components/submit-button";

export function ReviewGenerateButton() {
  return (
    <form action={generateReviewAction} className="mt-5">
      <SubmitButton idleLabel="Generate review" pendingLabel="Generating..." />
    </form>
  );
}
