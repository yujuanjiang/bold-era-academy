"use client";

import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/supabase-client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResult = {
  ok: boolean;
  error?: string;
};

function displayNameFromUser(user: User | null) {
  if (!user) {
    return "";
  }

  const metadataName = user.user_metadata?.name;
  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  return user.email?.split("@")[0] ?? "Builder";
}

function authUserFromSession(session: Session | null): AuthUser | null {
  const user = session?.user;

  if (!user?.email) {
    return null;
  }

  return {
    id: user.id,
    name: displayNameFromUser(user),
    email: user.email,
  };
}

export function useLocalAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session);
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const currentUser = useMemo(() => authUserFromSession(session), [session]);

  async function register({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResult> {
    if (!supabase || !isSupabaseConfigured) {
      return {
        ok: false,
        error: "Supabase is not configured yet.",
      };
    }

    const cleanedName = name.trim();
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedPassword = password.trim();

    if (!cleanedName) {
      return { ok: false, error: "Please enter your name." };
    }

    if (!cleanedEmail.includes("@")) {
      return { ok: false, error: "Please enter a valid email address." };
    }

    if (cleanedPassword.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanedEmail,
      password: cleanedPassword,
      options: {
        data: {
          name: cleanedName,
        },
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        name: cleanedName,
        email: cleanedEmail,
        updated_at: new Date().toISOString(),
      });
    }

    return { ok: true };
  }

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResult> {
    if (!supabase || !isSupabaseConfigured) {
      return {
        ok: false,
        error: "Supabase is not configured yet.",
      };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  }

  async function signOut() {
    await supabase?.auth.signOut();
  }

  return {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isLoading,
    register,
    signIn,
    signOut,
  };
}
