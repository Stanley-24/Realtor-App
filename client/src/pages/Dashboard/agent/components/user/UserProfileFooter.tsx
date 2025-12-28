// src/pages/Dashboard/agent/components/UserProfileFooter.tsx

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar-context";
import { ProfileEditModal } from "./ProfileSettingsModal";
import { AgentSettingsModal } from "./AgentSettingModal";


const user = {
  name: "Stanley Owarieta",
  email: "stanley@realtorpro.com",
  avatar: "https://static.vecteezy.com/system/resources/thumbnails/005/346/410/small/close-up-portrait-of-smiling-handsome-young-caucasian-man-face-looking-at-camera-on-isolated-light-gray-studio-background-photo.jpg",
  phone: "123-456-7890",
  headline: "Experienced Real Estate Agent",
  about: "Passionate about helping clients find their dream homes.",
  location: "New York, NY",
  role: "Agent",
  verified: true,
  registrationYear: 2015,
};

export function UserProfileFooter() {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const { state, isMobile } = useSidebar(); // ← Get both state and isMobile
  const isCollapsed = state === "collapsed";

  // On mobile, we ALWAYS show expanded view (name + three dots)
  // On desktop, only show expanded when not collapsed
  const showExpanded = isMobile || !isCollapsed;

  const openAccountModal = () => setIsAccountModalOpen(true);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem className="relative">
          <SidebarMenuButton
            onClick={openAccountModal}
            className={cn(
              "w-full gap-3 hover:bg-transparent",
              // Reserve space for three dots when expanded
              showExpanded && "pr-10",
              // On desktop collapsed: center avatar only
              !showExpanded && "justify-center px-0"
            )}
          >
            <Avatar className="h-8 w-8 shrink-0 text-gray-800">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>SO</AvatarFallback>
            </Avatar>

            {/* Name & email - shown when expanded (including mobile) */}
            {showExpanded && (
              <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-gray-900">{user.email}</span>
              </div>
            )}
          </SidebarMenuButton>

          {/* Three dots - shown when expanded (including mobile) */}
          {showExpanded && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  openAccountModal();
                }}
              >
                <MoreHorizontal className="h-5 w-5 text-foreground/80" />
              </Button>
            </div>
          )}
        </SidebarMenuItem>
      </SidebarMenu>

      {/* My Account Modal */}
      <Dialog open={isAccountModalOpen} onOpenChange={setIsAccountModalOpen}>
        <DialogContent className="sm:max-w-[325px]">
          <DialogHeader>
            <DialogTitle>My Account</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                setIsAccountModalOpen(false);
                setIsProfileModalOpen(true);
              }}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                setIsAccountModalOpen(false);
                setIsSettingsModalOpen(true);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="justify-start text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ProfileEditModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />

      <AgentSettingsModal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
      />
    </>
  );
}