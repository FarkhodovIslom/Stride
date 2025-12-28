"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button, Input, Card } from "@/components/ui";

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UserProfile() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setEditName(userData.name || "");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editName.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditName(user?.name || "");
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-4 bg-[var(--muted)] rounded animate-pulse"></div>
          <div className="h-4 bg-[var(--muted)] rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-[var(--muted)] rounded animate-pulse w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="p-6">
        <p className="text-[var(--muted-foreground)]">Failed to load user profile</p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            User Profile
          </h2>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="text-sm"
            >
              Edit Profile
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
              Name
            </label>
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
                className="max-w-md"
              />
            ) : (
              <p className="text-[var(--foreground)] font-medium">
                {user.name || "No name set"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
              Email
            </label>
            <p className="text-[var(--foreground)]">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
              Member Since
            </label>
            <p className="text-[var(--foreground)]">
              {formatDate(user.createdAt)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
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
              disabled={isSaving || !editName.trim()}
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
  );
}
