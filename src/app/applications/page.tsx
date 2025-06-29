"use client";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { getUserApplications, withdrawApplication } from "./actions";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<
    Awaited<ReturnType<typeof getUserApplications>>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const apps = await getUserApplications();
        setApplications(apps || []);
      } catch {
        setError("Failed to load applications");
      }
    });
  }, []);

  const handleWithdraw = async (trainingId: number) => {
    setWithdrawing(trainingId);
    setError(null);
    try {
      await withdrawApplication(trainingId);
      setApplications((apps) =>
        apps.map((app) =>
          app.trainingId === trainingId ? { ...app, status: "withdrawn" } : app,
        ),
      );
    } catch {
      setError("Failed to withdraw application");
    }
    setWithdrawing(null);
  };

  return (
    <div className="container py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      {isPending ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : applications.length === 0 ? (
        <div>No applications found.</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.applicationId}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">
                  Training ID: {app.trainingId}
                </div>
                <div>
                  Status: <span className="capitalize">{app.status}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Applied at: {new Date(app.appliedAt).toLocaleString()}
                </div>
              </div>
              {app.status === "pending" || app.status === "applied" ? (
                <Button
                  variant="destructive"
                  disabled={withdrawing === app.trainingId}
                  onClick={() => handleWithdraw(app.trainingId)}
                >
                  {withdrawing === app.trainingId
                    ? "Withdrawing..."
                    : "Withdraw"}
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
