import React, { useState, useEffect } from "react";
import { getSupabaseClient } from "../utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { User, LogOut, Save } from "lucide-react";
import { toast } from "sonner";

interface SettingsPageProps {
  accessToken: string;
  apiBaseUrl: string;
  user: any;
  onLogout: () => void;
  onUserUpdate: (updatedUser: any) => void;
}
export function SettingsPage({
  accessToken,
  apiBaseUrl,
  user,
  onLogout,
  onUserUpdate,
}: SettingsPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = getSupabaseClient();

  useEffect(() => {
    if (user) {
      setName(
        user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.preferred_username ||
          "",
      );
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      toast.error("Full name cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: cleanName }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Profile update error:", data);
        toast.error(`Update failed: ${data.error || "Unknown error"}`);
        return;
      }
      const { data: localUserData, error: localUpdateError } =
        await supabase.auth.updateUser({
          data: {
            ...user?.user_metadata,
            name: cleanName,
            full_name: cleanName,
          },
        });

      if (localUpdateError) {
        console.warn("Local Supabase user update warning:", localUpdateError);
      }

      const updatedUser = localUserData.user || {
        ...user,
        user_metadata: {
          ...user?.user_metadata,
          name: cleanName,
          full_name: cleanName,
        },
      };

      onUserUpdate(updatedUser);
      setName(cleanName);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update processing error:", error);
      toast.error("Profile update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          Settings
        </h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.9375rem" }}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed
              </p>
            </div>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* API Configuration Info
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            API keys are configured server-side for security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div>
                <p className="font-medium">VirusTotal API</p>
                <p className="text-sm text-muted-foreground">File and URL threat analysis</p>
              </div>
              <div className="text-sm text-green-600">Configured</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div>
                <p className="font-medium">AbuseIPDB API</p>
                <p className="text-sm text-muted-foreground">IP reputation checking</p>
              </div>
              <div className="text-sm text-green-600">Configured</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div>
                <p className="font-medium">Qwen AI API</p>
                <p className="text-sm text-muted-foreground">AI-powered analysis reports</p>
              </div>
              <div className="text-sm text-green-600">Configured</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Contact your administrator to update API keys
          </p>
        </CardContent>
      </Card> */}

      <Separator />

      {/* Account Actions */}
      <Card>
        {/* <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader> */}
        <CardContent className="mt-4">
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
