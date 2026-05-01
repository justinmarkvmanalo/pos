import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseAuthClient, hasSupabasePublicEnv } from "@/lib/supabase";

const ACCESS_TOKEN_COOKIE = "pos-access-token";
const REFRESH_TOKEN_COOKIE = "pos-refresh-token";

export async function setAuthSession(session: Session) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.expires_in,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, session.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export const getOptionalUser = cache(async (): Promise<User | null> => {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return null;
  }

  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return null;
  }

  return data.user;
});

export const requireUser = cache(async (): Promise<User> => {
  const user = await getOptionalUser();
  if (!user) {
    redirect("/login");
  }

  return user;
});
