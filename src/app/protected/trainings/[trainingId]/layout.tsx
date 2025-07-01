import { getTrainingFullData } from "@/dao/getTrainingFullData";
import { getUserData } from "@/lib/session";
import Link from "next/link";
import React from "react";
import { TrainingNavigation } from "@/components/training/TrainingNavigation";
import { getStaffRoles } from "@/dao/getStaffRoles";
import TrainingProvider from "@/providers/training";
import { StaffNav } from "./StaffNav";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";

function Breadcrumb({
  trainingName,
  section,
}: {
  trainingName: string;
  section?: string;
}) {
  return (
    <nav className="text-sm mb-4 text-muted-foreground">
      <Link href="/protected/trainings">Dashboard</Link> &gt;{" "}
      <Link href="/protected/trainings/my-trainings">My Trainings</Link> &gt;{" "}
      <span>{trainingName}</span>
      {section && <span> &gt; {section}</span>}
    </nav>
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
  if (!user) {
    return;
  }

  // Fetch training data with userId to get userRoles
  const trainingData = await getTrainingFullData({
    trainingId: trainingIdNumber,
    userId,
  });

  const trainingName = trainingData.title;

  // Use userRoles from trainingData
  const userRoles = await getStaffRoles({
    userId,
    trainingId: trainingIdNumber,
  });
  const userPermisions = (
    await getUserTrainingPermissions(user.userId, Number(trainingId))
  ).filter((x) => x != "View:trainee");

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
      <TrainingNavigation trainingId={trainingIdNumber} userId={userId} />
      <StaffNav userPermisions={userPermisions} trainingId={Number(trainingId)}></StaffNav>
      <main>
        <TrainingProvider trainingData={trainingData}>
          {children}
        </TrainingProvider>
      </main>
    </div>
  );
}
