"use client";

import UserProfile from "./UserProfile";
import ColorTheme from "./ColorTheme";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Settings
        </h1>
        <p className="text-[var(--muted-foreground)] mt-2">
          Manage your account preferences and customize your experience
        </p>
      </div>

      <div className="space-y-6">
        <UserProfile />
        <ColorTheme />
      </div>
    </div>
  );
}
