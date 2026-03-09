import React, { useState, useEffect } from "react";
import { getSupabaseClient } from "./utils/supabase/client";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { DashboardPage } from "./components/DashboardPage";
import { HistoryPage } from "./components/HistoryPage";
import { SettingsPage } from "./components/SettingsPage";
import { DocumentationPage } from "./components/DocumentationPage";
import { Button } from "./components/ui/button";
import { cn } from "./components/ui/utils";
import {
  Shield,
  LayoutDashboard,
  History,
  Settings,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import { Toaster } from "./components/ui/sonner";

type Page = "dashboard" | "history" | "settings" | "documentation";
type AuthPage = "login" | "signup";

export default function App() {
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const supabase = getSupabaseClient();

  useEffect(() => {
    // Check for existing session
    checkSession();

    // Close sidebar on mobile by default
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        setAccessToken(session.access_token);
        setUser(session.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Session check error:", error);
    }
  };

  const handleLoginSuccess = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleSignupSuccess = () => {
    setAuthPage("login");
  };

  const handleLogout = () => {
    setAccessToken("");
    setUser(null);
    setIsAuthenticated(false);
    setAuthPage("login");
  };

  if (!isAuthenticated) {
    if (authPage === "login") {
      return (
        <>
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setAuthPage("signup")}
          />
          <Toaster />
        </>
      );
    } else {
      return (
        <>
          <SignupPage
            onSignupSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setAuthPage("login")}
          />
          <Toaster />
        </>
      );
    }
  }

  const navigationItems = [
    { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
    { id: "history" as Page, label: "History", icon: History },
    { id: "settings" as Page, label: "Settings", icon: Settings },
    // { id: "documentation" as Page, label: "Documentation", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        )}
        style={{ backgroundColor: "var(--sidebar)" }}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className="flex items-center gap-3 p-4 sm:p-6"
            style={{ borderBottom: "1px solid var(--sidebar-border)" }}
          >
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--sidebar-primary)" }}
            >
              <Shield
                className="w-5 h-5 sm:w-6 sm:h-6"
                style={{ color: "var(--sidebar-primary-foreground)" }}
              />
            </div>
            <div>
              <h2
                className="text-base sm:text-lg"
                style={{
                  color: "var(--sidebar-foreground)",
                  fontWeight: "var(--font-weight-bold)",
                  letterSpacing: "-0.01em",
                }}
              >
                CTI Platform
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }}
              >
                Threat Intelligence
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base"
                  )}
                  style={{
                    backgroundColor: isActive
                      ? "var(--sidebar-primary)"
                      : "transparent",
                    color: isActive
                      ? "var(--sidebar-primary-foreground)"
                      : "var(--sidebar-foreground)",
                    fontWeight: isActive
                      ? "var(--font-weight-semibold)"
                      : "var(--font-weight-medium)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor =
                        "var(--sidebar-accent)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info */}
          <div
            className="p-3 sm:p-4"
            style={{ borderTop: "1px solid var(--sidebar-border)" }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--sidebar-primary)",
                  color: "var(--sidebar-primary-foreground)",
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                <span className="text-xs sm:text-sm">
                  {user?.user_metadata?.name?.[0]?.toUpperCase() ||
                    user?.email?.[0]?.toUpperCase() ||
                    "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs sm:text-sm truncate"
                  style={{
                    color: "var(--sidebar-foreground)",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  {user?.user_metadata?.name || "User"}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "var(--sidebar-foreground)", opacity: 0.6 }}
                >
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          "md:ml-64" // Always margin on desktop
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b">
          <div className="flex items-center justify-between p-3 sm:p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden" // Only show on mobile
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            {/* Desktop toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-2 sm:gap-4">
              <div
                className="text-xs sm:text-sm text-muted-foreground hidden sm:block"
                style={{ fontWeight: "var(--font-weight-medium)" }}
              >
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div
                className="text-xs text-muted-foreground sm:hidden"
                style={{ fontWeight: "var(--font-weight-medium)" }}
              >
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-4 md:p-6">
          {currentPage === "dashboard" && (
            <DashboardPage accessToken={accessToken} />
          )}
          {currentPage === "history" && (
            <HistoryPage accessToken={accessToken} />
          )}
          {currentPage === "settings" && (
            <SettingsPage
              accessToken={accessToken}
              user={user}
              onLogout={handleLogout}
            />
          )}
          {currentPage === "documentation" && <DocumentationPage />}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
