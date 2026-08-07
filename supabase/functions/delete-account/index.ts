import { createClient } from "npm:@supabase/supabase-js@2.108.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function readJsonKey(envName: string, keyName: string) {
  const value = Deno.env.get(envName);

  if (!value) {
    return undefined;
  }

  try {
    const keys = JSON.parse(value) as Record<string, string | undefined>;

    return keys[keyName];
  } catch {
    return undefined;
  }
}

function getPublishableKey() {
  return (
    readJsonKey("SUPABASE_PUBLISHABLE_KEYS", "default") ??
    Deno.env.get("SUPABASE_ANON_KEY")
  );
}

function getSecretKey() {
  return (
    readJsonKey("SUPABASE_SECRET_KEYS", "default") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = getPublishableKey();
  const secretKey = getSecretKey();
  const authorization = request.headers.get("Authorization");

  if (!supabaseUrl || !publishableKey || !secretKey) {
    return jsonResponse({ error: "Account deletion is not configured." }, 500);
  }

  if (!authorization?.startsWith("Bearer ")) {
    return jsonResponse({ error: "Please sign in again first." }, 401);
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  });
  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return jsonResponse({ error: "Please sign in again first." }, 401);
  }

  const adminClient = createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return jsonResponse(
      { error: "We could not delete this account. Please try again." },
      500
    );
  }

  return jsonResponse({ ok: true });
});
