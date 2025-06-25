import Link from "next/link";
import React from "react";
import { getUserTrainingPermissions, type TrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";

export type TrainingNavLink = {
  perm: TrainingPermissions;
  href: string;
  label: string;
};

export async function TrainingNavigation({
  trainingId,
  userId,
  className = "",
}: {
  trainingId: number;
  userId?: string;
  className?: string;
}) {
  // Fetch permissions for the user
  const permissions: TrainingPermissions[] = userId
    ? await getUserTrainingPermissions(userId, trainingId)
    : [];

  // Define navigation links
  const links: TrainingNavLink[] = [
    { perm: "View:trainee", href: `/protected/trainings/${trainingId}`, label: "Overview" },
    { perm: "View:material", href: `/protected/trainings/${trainingId}/materials`, label: "Materials" },
    { perm: "View:contest", href: `/protected/trainings/${trainingId}/contests`, label: "Contests" },
    { perm: "View:standing", href: `/protected/trainings/${trainingId}/leaderboard`, label: "Leaderboard" },
    { perm: "Edit:staff", href: `/protected/trainings/${trainingId}/staff/edit-training/add-staff`, label: "Manage Staff" },
    { perm: "Edit:training", href: `/protected/trainings/${trainingId}/staff/edit-training`, label: "Edit Training" },
    { perm: "Edit:block", href: `/protected/trainings/${trainingId}/staff/edit-blocks`, label: "Edit Blocks" },
    { perm: "Edit:standing", href: `/protected/trainings/${trainingId}/staff/edit-standing-view`, label: "Standing View" },
  ];

  // Only show links the user has permission for, or always Overview if any permission
  const filteredLinks = links.filter(
    (link) =>
      permissions.includes(link.perm) ||
      (link.perm === "View:trainee" && permissions.length > 0)
  );

  return (
    <nav className={`mb-8 flex gap-2 border-b pb-2 ${className}`}>
      {filteredLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground font-medium"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
} 