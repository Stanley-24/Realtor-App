// src/pages/Dashboard/agent/components/ProfileEditModal.tsx

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Camera } from "lucide-react";
import { useUserProfileStore, } from "@/store/useUserProfileStore";
import type { UserProfile } from "@/lib/types";
import { toast } from "sonner";


interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileEditModal({ open, onOpenChange }: ProfileEditModalProps) {
  const { profile, updateProfile, loading } = useUserProfileStore();

  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [editingFields, setEditingFields] = useState<{ [key: string]: boolean }>({});
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync formData when modal opens or profile changes
  useEffect(() => {
    if (open && profile) {
      setFormData(profile);
      setPreviewAvatar(null);
      setAvatarFile(null);
      setEditingFields({});
    }
  }, [open, profile]);

  if (!profile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[150px] max-w-[200px]">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-pinky mb-4" />
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startEditing = (field: string) => {
    setEditingFields({ ...editingFields, [field]: true });
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewAvatar(url);
      setAvatarFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    const updates: Partial<UserProfile> = {
      name: formData.name,
      phone: formData.phone,
      headline: formData.headline,
      about: formData.about,
      location: formData.location,
    };

    try {
      await updateProfile(updates, avatarFile);
      onOpenChange(false);
    } catch (err) {
      // Error already set in store, you can show toast here if needed
      console.error("Profile update failed", err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const editableFields = ["name", "phone", "headline", "location"] as const;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-gray-900/95 backdrop-blur-xl border border-gray-800 text-gray-100 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 py-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="h-32 w-32 ring-4 ring-gray-800">
                <AvatarImage src={previewAvatar || formData.avatar} className="object-cover" />
                <AvatarFallback className="bg-gray-800 text-3xl">
                  {formData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleAvatarClick}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-8 w-8 text-white" />
              </button>
            </div>
            <p className="text-sm text-gray-400">Click to change avatar</p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Editable Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            {editableFields.map((field) => (
              <div key={field} className="group relative">
                <Label className="capitalize text-gray-300 mb-2">
                  {field === "phone" ? "Phone" : field.replace(/([A-Z])/g, " $1").trim()}
                </Label>
                {editingFields[field] ? (
                  <Input
                    name={field}
                    value={String(formData[field as keyof typeof formData])}
                    onChange={handleChange}
                    className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-pinky focus:ring-pinky"
                  />
                ) : (
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <p className="text-gray-100">{formData[field as keyof typeof formData] || "Not set"}</p>
                    <button
                      onClick={() => startEditing(field)}
                      className="p-2 hover:bg-gray-700 rounded transition"
                    >
                      <Edit className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* About */}
          <div className="group relative">
            <Label className="text-gray-300 mb-2">About</Label>
            {editingFields["about"] ? (
              <Textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-pinky focus:ring-pinky resize-none"
              />
            ) : (
              <div className="relative py-4 px-5 bg-gray-800/30 rounded-lg border border-gray-700">
                <p className="text-gray-100 pr-10">{formData.about || "No bio yet."}</p>
                <button
                  onClick={() => startEditing("about")}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded transition"
                >
                  <Edit className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* Read-only Info */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
            <div>
              <Label className="text-gray-400">Email</Label>
              <p className="text-lg text-gray-100 mt-1">{formData.email}</p>
            </div>
            <div>
              <Label className="text-gray-400">Role</Label>
              <p className="text-lg text-gray-100 mt-1 capitalize">{formData.role}</p>
            </div>
            <div>
              <Label className="text-gray-400">Verified</Label>
              <div className="mt-1">
                <Badge variant={formData.verified ? "default" : "destructive"} className="bg-pinky/20 text-pinky border-pinky/30">
                  {formData.verified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-gray-400">Member Since</Label>
              <p className="text-lg text-gray-100 mt-1">{formData.registrationYear}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-700 hover:bg-gray-800">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-pinky hover:bg-pinky/90 text-white px-8">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}