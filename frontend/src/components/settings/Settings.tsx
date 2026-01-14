"use client";

import UserProfile from "./UserProfile";
import ColorTheme from "./ColorTheme";
import PasswordChange from "./PasswordChange";
import { Settings as SettingsIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  return (
    <div className="space-y-6">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-8 h-8 text-primary-400" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Settings
          </h1>
        </div>
        <p className="text-[var(--muted-foreground)]">
          Manage your account preferences and customize your experience
        </p>
      </motion.div>

      <div className="space-y-6">
        <UserProfile />
        <PasswordChange />
        <ColorTheme />
      </div>
    </div>
  );
}
