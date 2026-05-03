"use server";

import { revalidatePath } from "next/cache";
import { requireAuthContext } from "@/lib/auth";
import { getCurrentWeekIso } from "@/lib/data";
import { errorActionState, successActionState, type ActionState } from "@/lib/form-state";
import { buildWeeklyReviewText } from "@/lib/review";
import { getSupabaseUserServerClient } from "@/lib/supabase";

async function getSupabaseOrThrow() {
  const auth = await requireAuthContext();
  const supabase = getSupabaseUserServerClient(auth.accessToken);
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return {
    supabase,
    userId: auth.user.id,
  };
}

function getTrimmedField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function calculateGoalProgress(statuses: string[]) {
  if (statuses.length === 0) {
    return 0;
  }

  const completedCount = statuses.filter((status) => status === "done").length;
  return Math.round((completedCount / statuses.length) * 100);
}

async function syncGoalProgress(supabase: Awaited<ReturnType<typeof getSupabaseOrThrow>>["supabase"], goalId: string) {
  const { data: milestones, error } = await supabase
    .from("milestones")
    .select("status")
    .eq("goal_id", goalId);

  if (error) {
    throw new Error(error.message);
  }

  const progress = calculateGoalProgress((milestones ?? []).map((milestone) => milestone.status));
  const { error: updateError } = await supabase.from("goals").update({ progress }).eq("id", goalId);

  if (updateError) {
    throw new Error(updateError.message);
  }
}

type MilestoneRecord = {
  id: string;
  status: "done" | "active" | "up-next";
  sort_order: number;
};

function enforceMilestoneSequence(milestones: MilestoneRecord[]) {
  const nextMilestones = milestones
    .map((milestone, index) => ({
      ...milestone,
      sort_order: index + 1,
    }))
    .sort((left, right) => left.sort_order - right.sort_order);

  const activeMilestones = nextMilestones.filter((milestone) => milestone.status === "active");
  if (activeMilestones.length > 1) {
    const [firstActive, ...rest] = activeMilestones;
    for (const milestone of rest) {
      if (milestone.id !== firstActive.id) {
        milestone.status = "up-next";
      }
    }
  }

  const hasActiveMilestone = nextMilestones.some((milestone) => milestone.status === "active");
  if (!hasActiveMilestone) {
    const nextAvailableMilestone = nextMilestones.find((milestone) => milestone.status !== "done");
    if (nextAvailableMilestone) {
      nextAvailableMilestone.status = "active";
    }
  }

  return nextMilestones;
}

function normalizeMilestoneStatuses(
  milestones: MilestoneRecord[],
  milestoneId: string,
  nextStatus: MilestoneRecord["status"],
) {
  const nextMilestones = milestones.map((milestone) => {
    if (milestone.id !== milestoneId) {
      return { ...milestone };
    }

    return {
      ...milestone,
      status: nextStatus,
    };
  });

  if (nextStatus === "active") {
    for (const milestone of nextMilestones) {
      if (milestone.id !== milestoneId && milestone.status === "active") {
        milestone.status = "up-next";
      }
    }
  }

  return enforceMilestoneSequence(nextMilestones);
}

function revalidateApp() {
  revalidatePath("/");
  revalidatePath("/goals");
  revalidatePath("/habits");
  revalidatePath("/capture");
  revalidatePath("/review");
}

async function createGoalRecord(
  supabase: Awaited<ReturnType<typeof getSupabaseOrThrow>>["supabase"],
  userId: string,
  {
    title,
    ownerNote,
    deadline,
    starterMilestones,
  }: {
    title: string;
    ownerNote: string;
    deadline: string | null;
    starterMilestones: string[];
  },
) {
  const { data: goal, error } = await supabase
    .from("goals")
    .insert({
      owner_id: userId,
      title,
      owner_note: ownerNote,
      deadline,
      progress: 0,
    })
    .select("id")
    .single();

  if (error || !goal) {
    return errorActionState(error?.message ?? "Could not create the goal.");
  }

  if (starterMilestones.length > 0) {
    const { error: milestoneError } = await supabase.from("milestones").insert(
      starterMilestones.map((milestone, index) => ({
        owner_id: userId,
        goal_id: goal.id,
        name: milestone,
        status: index === 0 ? "active" : "up-next",
        sort_order: index + 1,
      })),
    );

    if (milestoneError) {
      return errorActionState(milestoneError.message);
    }
  }

  await syncGoalProgress(supabase, goal.id);
  revalidateApp();
  return successActionState("Goal added.");
}

export async function createTaskAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, userId } = await getSupabaseOrThrow();

  const title = getTrimmedField(formData, "title");
  const note = getTrimmedField(formData, "note");
  const energy = getTrimmedField(formData, "energy") || "Medium lift";
  const focusOrder = Number(formData.get("focus_order") ?? 1);
  const taskDate = getTrimmedField(formData, "task_date") || new Date().toISOString().slice(0, 10);

  if (!title) {
    return errorActionState("Task title is required.");
  }

  const { error } = await supabase.from("tasks").insert({
    owner_id: userId,
    title,
    note,
    energy,
    focus_order: focusOrder,
    task_date: taskDate,
  });

  if (error) {
    return errorActionState(error.message);
  }

  revalidateApp();
  return successActionState("Task added.");
}

export async function createGoalAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, userId } = await getSupabaseOrThrow();

  const title = getTrimmedField(formData, "title");
  const ownerNote = getTrimmedField(formData, "owner_note");
  const deadline = getTrimmedField(formData, "deadline") || null;
  const starterMilestones = formData
    .getAll("starter_milestones")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (!title) {
    return errorActionState("Goal title is required.");
  }

  return createGoalRecord(supabase, userId, {
    title,
    ownerNote,
    deadline,
    starterMilestones,
  });
}

export async function createSuggestedGoalAction(formData: FormData) {
  await createGoalAction(successActionState(""), formData);
}

export async function updateGoalDeadlineAction(formData: FormData) {
  const { supabase } = await getSupabaseOrThrow();

  const goalId = getTrimmedField(formData, "goal_id");
  const deadline = getTrimmedField(formData, "deadline") || null;

  if (!goalId) {
    return;
  }

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("id")
    .eq("id", goalId)
    .maybeSingle();

  if (goalError || !goal) {
    return;
  }

  const { error } = await supabase.from("goals").update({ deadline }).eq("id", goalId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateApp();
}

export async function createMilestoneAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, userId } = await getSupabaseOrThrow();

  const goalId = getTrimmedField(formData, "goal_id");
  const name = getTrimmedField(formData, "name");

  if (!goalId || !name) {
    return errorActionState("Goal and milestone name are required.");
  }

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("id")
    .eq("id", goalId)
    .maybeSingle();

  if (goalError || !goal) {
    return errorActionState("Goal not found.");
  }

  const { data: existingMilestones, error: milestonesError } = await supabase
    .from("milestones")
    .select("id,status,sort_order")
    .eq("goal_id", goalId)
    .order("sort_order", { ascending: true });

  if (milestonesError) {
    return errorActionState(milestonesError.message);
  }

  const milestoneCount = existingMilestones?.length ?? 0;
  const status = milestoneCount === 0 ? "active" : "up-next";
  const sortOrder = milestoneCount + 1;

  const { error } = await supabase.from("milestones").insert({
    owner_id: userId,
    goal_id: goalId,
    name,
    status,
    sort_order: sortOrder,
  });

  if (error) {
    return errorActionState(error.message);
  }

  await syncGoalProgress(supabase, goalId);

  revalidateApp();
  return successActionState("Milestone added.");
}

export async function createSuggestedMilestoneAction(formData: FormData) {
  await createMilestoneAction(successActionState(""), formData);
}

export async function deleteGoalAction(formData: FormData) {
  const { supabase } = await getSupabaseOrThrow();

  const goalId = getTrimmedField(formData, "goal_id");

  if (!goalId) {
    return;
  }

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("id")
    .eq("id", goalId)
    .maybeSingle();

  if (goalError || !goal) {
    return;
  }

  const { error } = await supabase.from("goals").delete().eq("id", goalId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateApp();
}

export async function deleteMilestoneAction(formData: FormData) {
  const { supabase } = await getSupabaseOrThrow();

  const milestoneId = getTrimmedField(formData, "milestone_id");

  if (!milestoneId) {
    return;
  }

  const { data: milestone, error: milestoneError } = await supabase
    .from("milestones")
    .select("id,goal_id")
    .eq("id", milestoneId)
    .maybeSingle();

  if (milestoneError || !milestone) {
    return;
  }

  const { error: deleteError } = await supabase.from("milestones").delete().eq("id", milestoneId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { data: remainingMilestones, error: remainingError } = await supabase
    .from("milestones")
    .select("id,status,sort_order")
    .eq("goal_id", milestone.goal_id)
    .order("sort_order", { ascending: true });

  if (remainingError) {
    throw new Error(remainingError.message);
  }

  const normalizedMilestones = enforceMilestoneSequence((remainingMilestones ?? []) as MilestoneRecord[]);

  await Promise.all(
    normalizedMilestones.map(async ({ id, status, sort_order }) => {
      const { error: updateError } = await supabase
        .from("milestones")
        .update({ status, sort_order })
        .eq("id", id);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }),
  );

  await syncGoalProgress(supabase, milestone.goal_id);

  revalidateApp();
}

export async function updateMilestoneStatusAction(formData: FormData) {
  const { supabase } = await getSupabaseOrThrow();

  const milestoneId = getTrimmedField(formData, "milestone_id");
  const nextStatus = getTrimmedField(formData, "status") as MilestoneRecord["status"];
  const allowedStatuses: MilestoneRecord["status"][] = ["up-next", "active", "done"];

  if (!milestoneId || !allowedStatuses.includes(nextStatus)) {
    return;
  }

  const { data: milestone, error: milestoneError } = await supabase
    .from("milestones")
    .select("id,goal_id")
    .eq("id", milestoneId)
    .maybeSingle();

  if (milestoneError || !milestone) {
    return;
  }

  const { data: milestones, error } = await supabase
    .from("milestones")
    .select("id,status,sort_order")
    .eq("goal_id", milestone.goal_id)
    .order("sort_order", { ascending: true });

  if (error || !milestones) {
    return;
  }

  const normalizedMilestones = normalizeMilestoneStatuses(
    milestones as MilestoneRecord[],
    milestoneId,
    nextStatus,
  );

  await Promise.all(
    normalizedMilestones.map(async ({ id, status }) => {
      const { error: updateError } = await supabase.from("milestones").update({ status }).eq("id", id);
      if (updateError) {
        throw new Error(updateError.message);
      }
    }),
  );

  await syncGoalProgress(supabase, milestone.goal_id);

  revalidateApp();
}

export async function createHabitAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, userId } = await getSupabaseOrThrow();

  const name = getTrimmedField(formData, "name");
  const rawTargetFrequency = Number(formData.get("target_frequency") ?? 7);
  const targetFrequency = Number.isFinite(rawTargetFrequency)
    ? Math.min(7, Math.max(1, Math.round(rawTargetFrequency)))
    : 7;

  if (!name) {
    return errorActionState("Habit name is required.");
  }

  const { data: existingHabit, error: existingHabitError } = await supabase
    .from("habits")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (existingHabitError) {
    return errorActionState(existingHabitError.message);
  }

  if (existingHabit) {
    return errorActionState("Habit already exists.");
  }

  const { error } = await supabase.from("habits").insert({
    owner_id: userId,
    name,
    target_frequency: targetFrequency,
  });

  if (error) {
    return errorActionState(error.message);
  }

  revalidateApp();
  return successActionState("Habit added.");
}

export async function createSuggestedHabitAction(formData: FormData) {
  await createHabitAction(successActionState(""), formData);
}

export async function logHabitAction(formData: FormData) {
  const { supabase, userId } = await getSupabaseOrThrow();

  const habitId = getTrimmedField(formData, "habit_id");
  const completedOn = getTrimmedField(formData, "completed_on") || new Date().toISOString().slice(0, 10);

  if (!habitId) {
    return;
  }

  const { data: habit } = await supabase.from("habits").select("id").eq("id", habitId).maybeSingle();

  if (!habit) {
    return;
  }

  await supabase.from("habit_logs").upsert(
    {
      owner_id: userId,
      habit_id: habitId,
      completed_on: completedOn,
      completed: true,
    },
    {
      onConflict: "habit_id,completed_on",
    },
  );

  revalidateApp();
}

export async function createCaptureAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, userId } = await getSupabaseOrThrow();

  const body = getTrimmedField(formData, "body");

  if (!body) {
    return errorActionState("Capture text is required.");
  }

  const { error } = await supabase.from("captures").insert({
    owner_id: userId,
    body,
    source: "manual",
    archived: false,
  });

  if (error) {
    return errorActionState(error.message);
  }

  revalidateApp();
  return successActionState("Capture added.");
}

export async function generateReviewAction() {
  const { supabase, userId } = await getSupabaseOrThrow();
  const summary = await buildWeeklyReviewText();

  await supabase.from("weekly_reviews").upsert(
    {
      owner_id: userId,
      week_of: getCurrentWeekIso(),
      summary,
      prompt:
        "What created momentum this week, what introduced friction, and what should change before next Monday?",
    },
    {
      onConflict: "owner_id,week_of",
    },
  );

  revalidateApp();
}
