"use client";

import { Button } from "@/components/ui/button";
import { TrainingPermissions } from "@/lib/types/Training";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./StaffNav.module.css";

export function StaffNav({
  userPermisions,
  trainingId,
}: {
  userPermisions: TrainingPermissions[];
  trainingId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside() {
      if (isOpen) setIsOpen(false);
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  if (userPermisions.length < 1) return <></>;
  const links: { perm: TrainingPermissions; href: string; label: string }[] = [
    {
      perm: "Edit:contest",
      href: `/protected/trainings/${trainingId}/staff/contests`,
      label: "Contests Management",
    },
    {
      perm: "Edit:staff",
      href: `/protected/trainings/${trainingId}/staff/staff-management`,
      label: "Staff Management",
    },
    {
      perm: "Edit:staff",
      href: `/protected/trainings/${trainingId}/staff/assign-mentors`,
      label: "Assign Mentors",
    },
    {
      perm: "Edit:applications",
      href: `/protected/trainings/${trainingId}/staff/applications`,
      label: "Applications",
    },
    {
      perm: "Edit:training",
      href: `/protected/trainings/${trainingId}/staff/edit-training`,
      label: "Edit Training",
    },
    {
      perm: "Edit:block",
      href: `/protected/trainings/${trainingId}/staff/edit-blocks`,
      label: "Edit Blocks",
    },
    {
      perm: "Edit:standing",
      href: `/protected/trainings/${trainingId}/staff/edit-standing-view`,
      label: "Standing View",
    },
    {
      perm: "View:material",
      href: `/protected/trainings/${trainingId}/staff/materials`,
      label: "Materials Management",
    },
  ];
  const linksFiltered = links.filter((x) => userPermisions.includes(x.perm));

  return (
    <>
      <Button
        className={cn(
          "rounded-full  bg-gray-200 hover:bg-gray-300 transition-colors duration-200 shadow-md fixed flex flex-row justify-center items-center",
          isOpen ? styles.rotate : styles.rotateBack,
        )}
        aria-label="Settings"
        style={{ bottom: "20px", right: "40px", height: "80px", width: "80px" }}
        onClick={() => {
          setIsOpen((x) => !x);
        }}
      >
        <Settings className="w-8 h-8 text-gray-700" />
      </Button>
      <div
        className={cn("bg-gray-100 flex flex-col items-start fixed shadow-md justify-around gap-2 bg-inherit flex-grow-0", 
        isOpen? styles.open : styles.close)}
        style={{ bottom: "80px", right: "40px" }}
      >
        {linksFiltered.map((link, idx) => (
          <Button
            key={idx}
            className="transition-colors duration-200 h-9 shadow-sm shadow-slate-100 w-full flex-grow-0 dark:bg-slate-800 dark:text-gray-300 p-3 dark:border-slate-500 border-[0.2px] "
            asChild
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </div>
    </>
  );
}
