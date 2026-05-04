"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAuthSession, getOptionalUser, requireAuthContext, setAuthSession } from "@/lib/auth";
import { errorActionState, successActionState, type ActionState } from "@/lib/form-state";
import { getSupabaseAuthClient, getSupabaseUserServerClient } from "@/lib/supabase";

function getTrimmedField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = getTrimmedField(formData, "email");
  const password = getTrimmedField(formData, "password");

  if (!email || !password) {
    return errorActionState("Email and password are required.");
  }

  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return errorActionState("Supabase auth is not configured.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return errorActionState(error?.message ?? "Login failed.");
  }

  await setAuthSession(data.session);
  redirect("/");
}

export async function signupAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const name = getTrimmedField(formData, "name");
  const email = getTrimmedField(formData, "email");
  const password = getTrimmedField(formData, "password");

  if (!name || !email || !password) {
    return errorActionState("Name, email, and password are required.");
  }

  if (password.length < 8) {
    return errorActionState("Password must be at least 8 characters.");
  }

  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return errorActionState("Supabase auth is not configured.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        avatar_url: "",
      },
    },
  });

  if (error) {
    return errorActionState(error.message);
  }

  if (data.session) {
    await setAuthSession(data.session);
    redirect("/");
  }

  return successActionState(
    "Account created. If email confirmation is enabled, verify your email before logging in.",
  );
}

export async function logoutAction() {
  await clearAuthSession();
  redirect("/login");
}

export async function updateProfileAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireAuthContext();
  const supabase = getSupabaseUserServerClient(auth.accessToken);

  if (!supabase) {
    return errorActionState("Supabase auth is not configured.");
  }

  const name = getTrimmedField(formData, "name");
  const email = getTrimmedField(formData, "email");
  const avatarUrl = getTrimmedField(formData, "avatar_url");

  if (!name || !email) {
    return errorActionState("Name and email are required.");
  }

  if (avatarUrl) {
    try {
      const parsedUrl = new URL(avatarUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return errorActionState("Profile picture must use an http or https URL.");
      }
    } catch {
      return errorActionState("Profile picture must be a valid URL.");
    }
  }

  const { error } = await supabase.auth.updateUser({
    email,
    data: {
      name,
      avatar_url: avatarUrl,
    },
  });

  if (error) {
    return errorActionState(error.message);
  }

  revalidatePath("/");
  revalidatePath("/profile");

  return successActionState("Profile updated.");
}

export async function redirectIfLoggedIn() {
  const user = await getOptionalUser();
  if (user) {
    redirect("/");
  }
}
