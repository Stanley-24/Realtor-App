// src/pages/Dashboard/agent/components/AppSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  PlusCircle,
  Edit3,
  Home,
  BarChart3,
  Mail,
  Trash2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UserProfileFooter } from "./user/UserProfileFooter";

const menuItems = [
  { title: "Create Property", icon: PlusCircle, url: "/dashboard/agent/create-property" },
  { title: "Update Listing", icon: Edit3, url: "/dashboard/agent/update-listing" },
  { title: "View My Listings", icon: Home, url: "/dashboard/agent/my-listings" },
  { title: "Analytics", icon: BarChart3, url: "/dashboard/agent/analytics" },
  { title: "Inbox", icon: Mail, url: "/dashboard/agent/inbox" },
  { title: "Recently Deleted", icon: Trash2, url: "/dashboard/agent/recently-deleted" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar
      collapsible="icon"
    >
      {/* Header - optional logo space */}
      <SidebarHeader className="h-16 border-b bg-btn-col/30">
        
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-2 pt-4 h-full"> {/* Added padding and top spacing */}
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.url}
                  className="text-lg font-medium text-gray-100 py-4 mt-1 md:py-5" // Larger font + better button padding
                >
                  <Link to={item.url}>
                    <item.icon className="md:h-8 md:w-8 h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Footer with padding and background */}
      <SidebarFooter className="pb-4 border-t bg-popover/80 text-gray-500"> {/* Padding + subtle background */}
        <UserProfileFooter />
      </SidebarFooter>
    </Sidebar>
  );
}