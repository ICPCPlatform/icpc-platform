"use client";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Trophy, Users } from "lucide-react";

export async function TrainingNavigation({
  trainingId,
  className = "",
}: {
  trainingId: number;
  className?: string;
}) {
  // Fetch permissions for the user

  // Define navigation links
  const links = [
    { href: `/protected/trainings/${trainingId}`, label: "Overview", icon: <Home className="w-4 h-4" /> },
    { href: `/protected/trainings/${trainingId}/materials`, label: "Materials", icon: <BookOpen className="w-4 h-4" /> },
    { href: `/protected/trainings/${trainingId}/contests`, label: "Contests", icon: <Trophy className="w-4 h-4" /> },
    { href: `/protected/trainings/${trainingId}/leaderboard`, label: "Leaderboard", icon: <Users className="w-4 h-4" /> },
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
          className="font-medium flex items-center gap-2"
        >
          <Link href={link.href} className="flex items-center gap-2">
            {link.icon} {link.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
