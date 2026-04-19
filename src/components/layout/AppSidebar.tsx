import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

import { Shield, LayoutDashboard, History, Settings } from "lucide-react";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  user: any;
  onLogout: () => void;
};

export function AppSidebar({ sidebarOpen, setSidebarOpen, user }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "history",
      label: "History",
      icon: History,
      path: "/history",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <>
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
          sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
        )}
        style={{
          backgroundColor: "var(--sidebar)",
        }}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className="flex items-center gap-3 p-4 sm:p-6"
            style={{
              borderBottom: "1px solid var(--sidebar-border)",
            }}
          >
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "var(--sidebar-primary)",
              }}
            >
              <Shield
                className="w-5 h-5 sm:w-6 sm:h-6"
                style={{
                  color: "var(--sidebar-primary-foreground)",
                }}
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
                style={{
                  color: "var(--sidebar-foreground)",
                  opacity: 0.7,
                }}
              >
                Threat Intelligence
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);

                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base",
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
            style={{
              borderTop: "1px solid var(--sidebar-border)",
            }}
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
                  style={{
                    color: "var(--sidebar-foreground)",
                    opacity: 0.6,
                  }}
                >
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
