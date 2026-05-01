"use server";

import { redirect } from "next/navigation";
import { clearAuthSession, getOptionalUser, setAuthSession } from "@/lib/auth";
import { getSupabaseAuthClient } from "@/lib/supabase";

export type ActionState = {
  message: string;
};

const initialState: ActionState = {
  message: "",
};

function getTrimmedField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = getTrimmedField(formData, "email");
  const password = getTrimmedField(formData, "password");

  if (!email || !password) {
    return { message: "Email and password are required." };
  }

  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return { message: "Supabase auth is not configured." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return { message: error?.message ?? "Login failed." };
  }

  await setAuthSession(data.session);
  redirect("/");
}

export async function signupAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const name = getTrimmedField(formData, "name");
  const email = getTrimmedField(formData, "email");
  const password = getTrimmedField(formData, "password");

  if (!name || !email || !password) {
    return { message: "Name, email, and password are required." };
  }

  if (password.length < 8) {
    return { message: "Password must be at least 8 characters." };
  }

  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return { message: "Supabase auth is not configured." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    return { message: error.message };
  }

  if (data.session) {
    await setAuthSession(data.session);
    redirect("/");
  }

  return {
    message: "Account created. If email confirmation is enabled, verify your email before logging in.",
  };
}

export async function logoutAction() {
  await clearAuthSession();
  redirect("/login");
}

export async function redirectIfLoggedIn() {
  const user = await getOptionalUser();
  if (user) {
    redirect("/");
  }
}

export { initialState as authInitialState };
