import { getTrainingFullData } from "@/dao/getTrainingFullData";
import { getUserData } from "@/lib/session";
import { getUserTrainingPermissions, type TrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import Link from "next/link";
import React from "react";

function Breadcrumb({ trainingName, section }: { trainingName: string; section?: string }) {
  return (
    <nav className="text-sm mb-4 text-muted-foreground">
      <Link href="/protected/trainings">Dashboard</Link> &gt; {" "}
      <Link href="/protected/trainings/my-trainings">My Trainings</Link> &gt; {" "}
      <span>{trainingName}</span>
      {section && <span> &gt; {section}</span>}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground font-medium">
      {children}
    </Link>
  );
}

export default async function TrainingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId } = await params;
  const trainingIdNumber = Number(trainingId);
  const user = await getUserData();
  const userId = user?.userId;
  // Fetch training data with userId to get userRoles
  const trainingData = await getTrainingFullData({ trainingId: trainingIdNumber, userId });
  const permissions: TrainingPermissions[] = user ? await getUserTrainingPermissions(user.userId, trainingIdNumber) : [];
  const trainingName = trainingData?.blocks?.[0]?.title ? `Training #${trainingIdNumber}` : `Training #${trainingIdNumber}`;
  // Use userRoles from trainingData
  const userRoles = trainingData.userRoles || [];

  // Navigation links based on permissions
  const links: { perm: TrainingPermissions; href: string; label: string }[] = [
    { perm: "View:trainee" as TrainingPermissions, href: `/protected/trainings/${trainingIdNumber}`, label: "Overview" },
    { perm: "View:material" as TrainingPermissions, href: `/protected/trainings/${trainingIdNumber}/materials`, label: "Materials" },
    { perm: "View:contest" as TrainingPermissions, href: `/protected/trainings/${trainingIdNumber}/contests`, label: "Contests" },
    { perm: "View:standing" as TrainingPermissions, href: `/protected/trainings/${trainingIdNumber}/leaderboard`, label: "Leaderboard" },
    { perm: "Edit:staff" as TrainingPermissions, href: `/protected/trainings/${trainingIdNumber}/staff/edit-training/add-staff`, label: "Manage Staff" },
    { perm: "Edit:training" as TrainingPermissions, href: `/protected/trainings/${trainingIdNumber}/staff/edit-training`, label: "Edit Training" },
    { perm: "Edit:block" as TrainingPermissions, href: `/protected/trainings/${trainingIdNumber}/staff/edit-blocks`, label: "Edit Blocks" },
    { perm: "Edit:standing" as TrainingPermissions, href: `/protected/trainings/${trainingIdNumber}/staff/edit-standing-view`, label: "Standing View" },
  ].filter(link => permissions.includes(link.perm) || (link.perm === "View:trainee" && permissions.length > 0));

  return (
    <div className="container mx-auto py-6">
      <Breadcrumb trainingName={trainingName} />
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-3xl font-bold">
          Training: {trainingName}
          <span className="ml-4 text-base font-normal text-muted-foreground">
            — Roles: {userRoles.length > 0 ? userRoles.join(", ") : "trainee"}
          </span>
        </h1>
      </header>
      <nav className="mb-8 flex gap-2 border-b pb-2">
        {links.map((link) => (
          <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
        ))}
      </nav>
      <main>{children}</main>
    </div>
  );
} 