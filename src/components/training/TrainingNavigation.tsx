"use client";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TrainingNavLink = {
  href: string;
  label: string;
};

export async function TrainingNavigation({
  trainingId,
  className = "",
}: {
  trainingId: number;
  className?: string;
}) {
  // Fetch permissions for the user

  // Define navigation links
  const links: TrainingNavLink[] = [
    { href: `/protected/trainings/${trainingId}`, label: "Overview" },
    {
      href: `/protected/trainings/${trainingId}/materials`,
      label: "Materials",
    },
    { href: `/protected/trainings/${trainingId}/contests`, label: "Contests" },
    {
      href: `/protected/trainings/${trainingId}/leaderboard`,
      label: "Leaderboard",
    },
  ];

  // Only show links the user has permission for, or always Overview if any permission

  return (
    <nav className={cn("flex flex-wrap gap-2 mb-8", className)}>
      {links.map((link) => (
        <Button
          key={link.href}
          variant="ghost"
          size="sm"
          asChild
          className="font-medium"
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </nav>
  );
}
