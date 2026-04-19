import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { getSupabaseClient } from "./utils/supabase/client";

import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { DashboardPage } from "./components/DashboardPage";
import { HistoryPage } from "./components/HistoryPage";
import { SettingsPage } from "./components/SettingsPage";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppSidebar } from "./components/layout/AppSidebar";

import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { Menu, X } from "lucide-react";

export default function App() {
  const supabase = getSupabaseClient();

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [accessToken, setAccessToken] = useState("");

  const [user, setUser] = useState<any>(null);

  /* ===========================================
     CHECK SESSION
  =========================================== */
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsAuthenticated(true);
        setAccessToken(session.access_token);
        setUser(session.user);
      }

      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setAccessToken(session.access_token);
        setUser(session.user);
      } else {
        setIsAuthenticated(false);
        setAccessToken("");
        setUser(null);
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ===========================================
     MOBILE SIDEBAR
  =========================================== */
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  /* ===========================================
     LOGIN SUCCESS
  =========================================== */
  const handleLoginSuccess = (token: string, userData: any) => {
    setIsAuthenticated(true);
    setAccessToken(token);
    setUser(userData);

    navigate("/dashboard");
  };

  /* ===========================================
     SIGNUP SUCCESS
  =========================================== */
  const handleSignupSuccess = () => {
    navigate("/login");
  };

  /* ===========================================
     LOGOUT
  =========================================== */
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /* ===========================================
     LOADING
  =========================================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  const showSidebar =
    isAuthenticated &&
    location.pathname !== "/login" &&
    location.pathname !== "/signup";

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* SIDEBAR */}
        {showSidebar && (
          <AppSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
            onLogout={handleLogout}
          />
        )}

        {/* CONTENT */}
        <div className={showSidebar ? "md:ml-64" : ""}>
          {/* Header */}
          {showSidebar && (
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
          )}
          {/* PAGE */}
          <main className={showSidebar ? "p-4 md:p-6" : ""}>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <LoginPage
                      onLoginSuccess={handleLoginSuccess}
                      onSwitchToSignup={() => navigate("/signup")}
                    />
                  )
                }
              />

              <Route
                path="/signup"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <SignupPage
                      onSignupSuccess={handleSignupSuccess}
                      onSwitchToLogin={() => navigate("/login")}
                    />
                  )
                }
              />

              {/* PRIVATE ROUTES */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <DashboardPage accessToken={accessToken} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <HistoryPage accessToken={accessToken} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <SettingsPage
                      accessToken={accessToken}
                      user={user}
                      onLogout={handleLogout}
                    />
                  </ProtectedRoute>
                }
              />

              {/* DEFAULT */}
              <Route
                path="/"
                element={
                  <Navigate
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    replace
                  />
                }
              />

              {/* NOT FOUND */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      <Toaster />
    </>
  );
}
