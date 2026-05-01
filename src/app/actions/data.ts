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
  const progress = Number(formData.get("progress") ?? 0);

  if (!title) {
    return { message: "Goal title is required." };
  }

  const { error } = await supabase.from("goals").insert({
    owner_id: userId,
    title,
    owner_note: ownerNote,
    deadline,
    progress,
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
  const status = getTrimmedField(formData, "status") || "up-next";
  const sortOrder = Number(formData.get("sort_order") ?? 1);

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

  revalidateApp();
  return { message: "Milestone added." };
}

export async function createHabitAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, userId } = await getSupabaseOrThrow();

  const name = getTrimmedField(formData, "name");
  const targetFrequency = Number(formData.get("target_frequency") ?? 7);

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
