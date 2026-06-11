/// <reference lib="deno.ns" />

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

import * as kv from "./kv_store.ts";
import {
  analyzeWithVirusTotal,
  analyzeWithAbuseIPDB,
  generateAIAnalysis,
} from "./threat-analysis.ts";

const app = new Hono().basePath("/server");
/* =====================================================
   SUPABASE CLIENT (SERVER SIDE)
===================================================== */
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

/* =====================================================
   GLOBAL MIDDLEWARE
===================================================== */

// logger
app.use("*", logger(console.log));

// CORS
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://wulqjwfknlbswsoztepl.supabase.co",
    ],
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// IMPORTANT: handle preflight request before auth middleware
app.options("*", (c) => {
  return c.body(null, 204);
});

/* =====================================================
   AUTH MIDDLEWARE
===================================================== */

const publicRoutes = ["/health"];

app.use("*", async (c, next) => {
  // Jangan blokir request preflight CORS
  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  if (publicRoutes.includes(c.req.path)) {
    return await next();
  }

  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return c.json({ error: "Invalid token" }, 401);
  }

  c.set("user", user);

  await next();
});

/* =====================================================
   ADMIN HELPER
===================================================== */

const requireAdmin = async (c: any, next: any) => {
  const user = c.get("user");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, email, name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  if (!profile || profile.role !== "admin") {
    return c.json({ error: "Forbidden: Admin access required" }, 403);
  }

  c.set("profile", profile);
  await next();
};

const writeActivityLog = async (
  c: any,
  action: string,
  module: string,
  details?: any,
) => {
  try {
    const user = c.get("user");

    await supabase.from("activity_logs").insert({
      user_id: user?.id ?? null,
      user_email: user?.email ?? null,
      action,
      module,
      details: details ?? {},
      ip_address:
        c.req.header("x-forwarded-for") ||
        c.req.header("cf-connecting-ip") ||
        null,
    });
  } catch (error) {
    console.error("Failed to write activity log:", error);
  }
};

/* =====================================================
   ADMIN - MANAGE USERS
===================================================== */

app.get("/admin/users", requireAdmin, async (c) => {
  try {
    const page = Number(c.req.query("page") || 1);
    const perPage = Number(c.req.query("perPage") || 50);

    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    const userIds = data.users.map((user) => user.id);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, role")
      .in("id", userIds);

    const profileMap = new Map(
      profiles?.map((profile) => [profile.id, profile]) ?? [],
    );

    const users = data.users.map((user) => ({
      id: user.id,
      email: user.email,
      emailConfirmedAt: user.email_confirmed_at,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
      name:
        profileMap.get(user.id)?.name ||
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        null,
      role: profileMap.get(user.id)?.role || "user",
    }));

    await writeActivityLog(c, "VIEW_USERS", "ADMIN_USERS", {
      page,
      perPage,
    });

    return c.json({
      success: true,
      users,
    });
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to fetch users" }, 500);
  }
});

app.post("/admin/users", requireAdmin, async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const selectedRole = role === "admin" ? "admin" : "user";

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      },
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      name: name || null,
      role: selectedRole,
      updated_at: new Date().toISOString(),
    });

    await writeActivityLog(c, "CREATE_USER", "ADMIN_USERS", {
      targetUserId: data.user.id,
      targetEmail: email,
      role: selectedRole,
    });

    return c.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name,
        role: selectedRole,
      },
    });
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to create user" }, 500);
  }
});

app.put("/admin/users/:id", requireAdmin, async (c) => {
  try {
    const id = c.req.param("id");
    const { email, password, name, role } = await c.req.json();

    const updatePayload: any = {};

    if (email) updatePayload.email = email;
    if (password) updatePayload.password = password;
    if (name) updatePayload.user_metadata = { name };

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await supabase.auth.admin.updateUserById(
        id,
        updatePayload,
      );

      if (error) {
        return c.json({ error: error.message }, 400);
      }
    }

    const profilePayload: any = {
      id,
      updated_at: new Date().toISOString(),
    };

    if (email) profilePayload.email = email;
    if (name) profilePayload.name = name;
    if (role === "admin" || role === "user") profilePayload.role = role;

    await supabase.from("profiles").upsert(profilePayload);

    await writeActivityLog(c, "UPDATE_USER", "ADMIN_USERS", {
      targetUserId: id,
      updatedFields: Object.keys({ email, password, name, role }).filter(
        (key) =>
          key === "password"
            ? Boolean(password)
            : Boolean(
                (
                  {
                    email,
                    name,
                    role,
                  } as any
                )[key],
              ),
      ),
    });

    return c.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to update user" }, 500);
  }
});

app.delete("/admin/users/:id", requireAdmin, async (c) => {
  try {
    const id = c.req.param("id");
    const user = c.get("user");

    if (id === user.id) {
      return c.json({ error: "Admin cannot delete own account" }, 400);
    }

    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    await writeActivityLog(c, "DELETE_USER", "ADMIN_USERS", {
      targetUserId: id,
    });

    return c.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to delete user" }, 500);
  }
});

/* =====================================================
   ADMIN - ACTIVITY LOGS
===================================================== */

app.get("/admin/activity-logs", requireAdmin, async (c) => {
  try {
    const limit = Number(c.req.query("limit") || 50);

    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    await writeActivityLog(c, "VIEW_ACTIVITY_LOGS", "ADMIN_LOGS", {
      limit,
    });

    return c.json({
      success: true,
      logs: data,
    });
  } catch (error: any) {
    return c.json(
      {
        error: error.message || "Failed to fetch activity logs",
      },
      500,
    );
  }
});

/* =====================================================
   PUBLIC ROUTE
===================================================== */

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    message: "CTI API Running",
  });
});

/* =====================================================
   ANALYZE THREAT
===================================================== */

app.post("/analyze", async (c) => {
  try {
    const user = c.get("user");
    const { type, value } = await c.req.json();

    let vtData = null;
    let abuseData = null;
    let aiAnalysis = "";

    try {
      vtData = await analyzeWithVirusTotal(type, value);
    } catch (error: any) {
      vtData = { error: error.message };
    }

    if (type === "ip") {
      try {
        abuseData = await analyzeWithAbuseIPDB(value);
      } catch (error: any) {
        abuseData = { error: error.message };
      }
    }

    try {
      aiAnalysis = await generateAIAnalysis(vtData, abuseData, type, value);
    } catch {
      aiAnalysis = "AI analysis unavailable";
    }

    const analysisId = `analysis_${user.id}_${Date.now()}`;

    await kv.set(analysisId, {
      userId: user.id,
      type,
      value,
      vtData,
      abuseData,
      aiAnalysis,
      timestamp: new Date().toISOString(),
    });

    await writeActivityLog(c, "ANALYZE_THREAT", "THREAT_ANALYSIS", {
      analysisId,
      type,
      value,
      hasVirusTotalData: Boolean(vtData),
      hasAbuseIPDBData: Boolean(abuseData),
      hasAIAnalysis: Boolean(aiAnalysis),
    });

    return c.json({
      success: true,
      analysisId,
      vtData,
      abuseData,
      aiAnalysis,
    });
  } catch (error) {
    return c.json({ error: "Analysis failed" }, 500);
  }
});

/* =====================================================
   SAVE HISTORY
===================================================== */

app.post("/history", async (c) => {
  try {
    const user = c.get("user");

    const { analysisId, fileName, format } = await c.req.json();

    const historyId = `history_${user.id}_${Date.now()}`;

    await kv.set(historyId, {
      userId: user.id,
      analysisId,
      fileName,
      format,
      downloadedAt: new Date().toISOString(),
    });

    await writeActivityLog(c, "SAVE_HISTORY", "REPORT_HISTORY", {
      historyId,
      analysisId,
      fileName,
      format,
    });

    return c.json({
      success: true,
      historyId,
    });
  } catch {
    return c.json({ error: "Failed to save history" }, 500);
  }
});

/* =====================================================
   GET HISTORY
===================================================== */

app.get("/history", async (c) => {
  try {
    const user = c.get("user");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, email, name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return c.json({ error: profileError.message }, 500);
    }

    const isAdmin = profile?.role === "admin";

    const historyItems = isAdmin
      ? await kv.getByPrefix("history_")
      : await kv.getByPrefix(`history_${user.id}_`);

    const sorted = historyItems.sort((a: any, b: any) => {
      return (
        new Date(b.downloadedAt || b.createdAt || 0).getTime() -
        new Date(a.downloadedAt || a.createdAt || 0).getTime()
      );
    });

    await writeActivityLog(c, "VIEW_HISTORY", "REPORT_HISTORY", {
      totalItems: sorted.length,
      scope: isAdmin ? "all_users" : "own_user",
    });

    return c.json({
      success: true,
      history: sorted,
      scope: isAdmin ? "all_users" : "own_user",
    });
  } catch (error: any) {
    return c.json(
      {
        error: error.message || "Failed to fetch history",
      },
      500,
    );
  }
});

/* =====================================================
   GET ANALYSIS BY ID
===================================================== */

app.get("/analysis/:id", async (c) => {
  try {
    const user = c.get("user");
    const id = c.req.param("id");

    const analysis = await kv.get(id);

    if (!analysis || analysis.userId !== user.id) {
      await writeActivityLog(c, "VIEW_ANALYSIS_DENIED", "THREAT_ANALYSIS", {
        analysisId: id,
        reason: "Not found or not owned by user",
      });

      return c.json({ error: "Not found" }, 404);
    }

    await writeActivityLog(c, "VIEW_ANALYSIS", "THREAT_ANALYSIS", {
      analysisId: id,
      type: analysis.type,
      value: analysis.value,
    });

    return c.json({
      success: true,
      analysis,
    });
  } catch {
    return c.json({ error: "Failed to fetch analysis" }, 500);
  }
});

/* =====================================================
   UPDATE PROFILE
===================================================== */

app.put("/profile", async (c) => {
  try {
    const user = c.get("user");
    const { name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { name },
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      name,
      updated_at: new Date().toISOString(),
    });

    await writeActivityLog(c, "UPDATE_PROFILE", "PROFILE", {
      updatedFields: {
        name: Boolean(name),
      },
    });

    return c.json({
      success: true,
      data,
    });
  } catch {
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

/* =====================================================
   ABUSE CHECK
===================================================== */

app.post("/abuse-check", async (c) => {
  try {
    const user = c.get("user");
    const { value } = await c.req.json();

    const data = await analyzeWithAbuseIPDB(value);

    await writeActivityLog(c, "ABUSE_CHECK", "THREAT_ANALYSIS", {
      value,
      hasResult: Boolean(data),
    });

    return c.json({
      success: true,
      data,
    });
  } catch (error: any) {
    await writeActivityLog(c, "ABUSE_CHECK_FAILED", "THREAT_ANALYSIS", {
      error: error.message || "Abuse check failed",
    });

    return c.json({
      error: error.message || "Abuse check failed",
    });
  }
});

/* =====================================================
   USER INFO
===================================================== */

app.get("/me", async (c) => {
  const user = c.get("user");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  await writeActivityLog(c, "VIEW_ME", "AUTH", {
    role: profile?.role || "user",
  });

  return c.json({
    success: true,
    user,
    profile,
    isAdmin: profile?.role === "admin",
  });
});

/* =====================================================
   NOT FOUND
===================================================== */

app.notFound((c) => {
  return c.json({ error: "Route not found" }, 404);
});

/* =====================================================
   START SERVER
===================================================== */

Deno.serve(app.fetch);
