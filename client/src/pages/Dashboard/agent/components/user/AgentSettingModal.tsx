// src/pages/Dashboard/agent/components/AgentSettingsModal.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface AgentSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentSettingsModal({
  open,
  onOpenChange,
}: AgentSettingsModalProps) {
  const [showLocation, setShowLocation] = useState(true);
  const [showEmail, setShowEmail] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePrivacySubmit = () => {
    console.log("Privacy settings saved:", { showLocation, showEmail });
    // TODO: Call backend API
  };

  const handlePasswordSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Password changed successfully");
    // TODO: Call backend API
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-gray-900/95 backdrop-blur-xl border border-gray-800 text-gray-100 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-100">Settings</DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 py-4">
          {/* Privacy Section */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-gray-100">Privacy</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between py-4 px-5 bg-gray-800/30 rounded-xl border border-gray-700 hover:bg-gray-800/50 transition-colors">
                <Label htmlFor="show-location" className="text-base text-gray-200 cursor-pointer">
                  Show location to buyers
                </Label>
                <Switch
                  id="show-location"
                  checked={showLocation}
                  onCheckedChange={setShowLocation}
                />
              </div>

              <div className="flex items-center justify-between py-4 px-5 bg-gray-800/30 rounded-xl border border-gray-700 hover:bg-gray-800/50 transition-colors">
                <Label htmlFor="show-email" className="text-base text-gray-200 cursor-pointer">
                  Show email to buyers
                </Label>
                <Switch
                  id="show-email"
                  checked={showEmail}
                  onCheckedChange={setShowEmail}
                />
              </div>
            </div>

            <Button
              onClick={handlePrivacySubmit}
              className="w-full bg-pinky hover:bg-pinky/90 text-white font-medium py-5 text-lg"
            >
              Save Privacy Settings
            </Button>
          </div>

          <Separator className="bg-gray-800" />

          {/* Security Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-100">Security</h3>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="old-password" className="text-gray-300">Old Password</Label>
                <Input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-pinky focus:ring-pinky py-6 text-base"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="new-password" className="text-gray-300">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-pinky focus:ring-pinky py-6 text-base"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-gray-300">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-pinky focus:ring-pinky py-6 text-base"
                />
              </div>
            </div>

            <Button
              onClick={handlePasswordSubmit}
              className="w-full bg-pinky hover:bg-pinky/90 text-white font-medium py-6 text-lg"
            >
              Change Password
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-6"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}