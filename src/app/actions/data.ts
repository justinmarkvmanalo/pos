"use server";

import { revalidatePath } from "next/cache";
import { requireAuthContext } from "@/lib/auth";
import { getCurrentWeekIso } from "@/lib/data";
import type { ActionState } from "@/lib/form-state";
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

  const activeMilestones = nextMilestones.filter((milestone) => milestone.status === "active");
  if (activeMilestones.length > 1) {
    const [firstActive, ...rest] = activeMilestones.sort((left, right) => left.sort_order - right.sort_order);
    for (const milestone of rest) {
      if (milestone.id !== firstActive.id) {
        milestone.status = "up-next";
      }
    }
  }

  const hasActiveMilestone = nextMilestones.some((milestone) => milestone.status === "active");
  if (!hasActiveMilestone) {
    const nextAvailableMilestone = [...nextMilestones]
      .sort((left, right) => left.sort_order - right.sort_order)
      .find((milestone) => milestone.status !== "done");

    if (nextAvailableMilestone) {
      nextAvailableMilestone.status = "active";
    }
  }

  return nextMilestones;
}

function revalidateApp() {
  revalidatePath("/");
  revalidatePath("/goals");
  revalidatePath("/habits");
  revalidatePath("/capture");
  revalidatePath("/review");
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
    return { message: "Task title is required." };
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
    return { message: error.message };
  }

  revalidateApp();
  return { message: "Task added." };
}

export async function createGoalAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, userId } = await getSupabaseOrThrow();

  const title = getTrimmedField(formData, "title");
  const ownerNote = getTrimmedField(formData, "owner_note");
  const deadline = getTrimmedField(formData, "deadline") || null;

  if (!title) {
    return { message: "Goal title is required." };
  }

  const { error } = await supabase.from("goals").insert({
    owner_id: userId,
    title,
    owner_note: ownerNote,
    deadline,
    progress: 0,
  });

  if (error) {
    return { message: error.message };
  }

  revalidateApp();
  return { message: "Goal added." };
}

export async function createMilestoneAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, userId } = await getSupabaseOrThrow();

  const goalId = getTrimmedField(formData, "goal_id");
  const name = getTrimmedField(formData, "name");

  if (!goalId || !name) {
    return { message: "Goal and milestone name are required." };
  }

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("id")
    .eq("id", goalId)
    .maybeSingle();

  if (goalError || !goal) {
    return { message: "Goal not found." };
  }

  const { data: existingMilestones, error: milestonesError } = await supabase
    .from("milestones")
    .select("id,status,sort_order")
    .eq("goal_id", goalId)
    .order("sort_order", { ascending: true });

  if (milestonesError) {
    return { message: milestonesError.message };
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
    return { message: error.message };
  }

  await syncGoalProgress(supabase, goalId);

  revalidateApp();
  return { message: "Milestone added." };
}

export async function createSuggestedMilestoneAction(formData: FormData) {
  await createMilestoneAction({ message: "" }, formData);
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
    return { message: "Habit name is required." };
  }

  const { error } = await supabase.from("habits").insert({
    owner_id: userId,
    name,
    target_frequency: targetFrequency,
  });

  if (error) {
    return { message: error.message };
  }

  revalidateApp();
  return { message: "Habit added." };
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
    return { message: "Capture text is required." };
  }

  const { error } = await supabase.from("captures").insert({
    owner_id: userId,
    body,
    source: "manual",
    archived: false,
  });

  if (error) {
    return { message: error.message };
  }

  revalidateApp();
  return { message: "Capture added." };
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
