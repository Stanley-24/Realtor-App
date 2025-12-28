// src/pages/Dashboard/agent/index.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import { useEffect } from "react";

export default function AgentDashboard() {

  const { fetchProfile, loading } = useUserProfileStore();

  useEffect(() => {
    fetchProfile(); // ← This is critical!
  }, [fetchProfile]);

  // Optional: Show loading skeleton while fetching
  if (loading) {
    return <div>Loading profile...</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header className="sticky top-0 z-40 bg-background border-b" />
        <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">
          <div className="mx-auto max-w-7xl w-full">
            <Outlet />
          </div>
        </main>
      </SidebarInset>

    </SidebarProvider>
  );
}
