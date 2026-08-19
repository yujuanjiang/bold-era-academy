import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseRequestTimeoutMs = 15000;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    supabaseRequestTimeoutMs
  );
  const existingSignal = init?.signal;

  function abortRequest() {
    controller.abort();
  }

  if (existingSignal?.aborted) {
    controller.abort();
  } else {
    existingSignal?.addEventListener("abort", abortRequest);
  }

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "The request timed out. Check your internet connection and try again."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
    existingSignal?.removeEventListener("abort", abortRequest);
  }
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      global: {
        fetch: fetchWithTimeout,
      },
    })
  : null;
