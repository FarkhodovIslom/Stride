"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card, useToast } from "@/components/ui";
import { useAuthStore } from "@/store/useAuthStore";
import { RefreshCw, User as UserIcon, Mail, Calendar, Clock } from "lucide-react";
import apiClient from "@/lib/api";
import { motion } from "framer-motion";
import { User } from "@/types";

export default function UserProfile() {
  const { setUser: setAuthUser } = useAuthStore();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await apiClient.get<User>("/users/profile", true);
      // Convert date strings from API to Date objects
      const userWithDates = {
        ...userData,
        createdAt: new Date(userData.createdAt),
        updatedAt: new Date(userData.updatedAt),
      };
      setUser(userWithDates);
      setEditName(userWithDates.name || "");
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError((err as Error).message || "Failed to load user profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }
    if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    if (name.trim().length > 50) {
      setNameError("Name must be less than 50 characters");
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleNameChange = (value: string) => {
    setEditName(value);
    if (nameError) {
      validateName(value);
    }
  };

  const handleSave = async () => {
    if (!validateName(editName)) return;

    setIsSaving(true);
    try {
      const updatedUser = await apiClient.patch<User>(
        "/users/profile",
        { name: editName.trim() },
        true
      );
      // Convert date strings from API to Date objects
      const userWithDates = {
        ...updatedUser,
        createdAt: new Date(updatedUser.createdAt),
        updatedAt: new Date(updatedUser.updatedAt),
      };
      setUser(userWithDates);
      setAuthUser(userWithDates);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error((err as Error).message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditName(user?.name || "");
    setNameError(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4" role="status" aria-label="Loading profile">
          <div className="h-8 bg-[var(--muted)] rounded animate-pulse w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-[var(--muted)] rounded animate-pulse"></div>
            <div className="h-4 bg-[var(--muted)] rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-[var(--muted)] rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchUserProfile} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6" role="region" aria-labelledby="profile-heading">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2
              id="profile-heading"
              className="text-2xl font-semibold text-[var(--foreground)]"
            >
              User Profile
            </h2>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="text-sm"
                aria-label="Edit your profile"
              >
                Edit Profile
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="profile-name"
                className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] mb-2"
              >
                <UserIcon className="w-4 h-4" aria-hidden="true" />
                Name
              </label>
              {isEditing ? (
                <div>
                  <Input
                    id="profile-name"
                    value={editName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => validateName(editName)}
                    placeholder="Enter your name"
                    className={`max-w-md ${nameError ? "border-red-500" : ""}`}
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? "name-error" : undefined}
                  />
                  {nameError && (
                    <p
                      id="name-error"
                      className="text-sm text-red-500 mt-1"
                      role="alert"
                    >
                      {nameError}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[var(--foreground)] font-medium">
                  {user.name || <span className="text-[var(--muted-foreground)] italic">No name set</span>}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] mb-2">
                <Mail className="w-4 h-4" aria-hidden="true" />
                Email
              </label>
              <p className="text-[var(--foreground)]">{user.email}</p>
            </div>

            {/* Member Since */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] mb-2">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                Member Since
              </label>
              <p className="text-[var(--foreground)]">
                {formatDate(user.createdAt)}
              </p>
            </div>

            {/* Last Updated */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] mb-2">
                <Clock className="w-4 h-4" aria-hidden="true" />
                Last Updated
              </label>
              <p className="text-[var(--foreground)]">
                {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
              <Button
                onClick={handleSave}
                disabled={isSaving || !!nameError}
                className="min-w-[80px]"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
