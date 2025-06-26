"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Application {
  applicationId: number;
  trainingId: number;
  status: string;
  appliedAt: string;
  updatedAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => {
        setApplications(data.applications || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load applications");
        setLoading(false);
      });
  }, []);

  const handleWithdraw = async (trainingId: number) => {
    setWithdrawing(trainingId);
    setError(null);
    const res = await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainingId }),
    });
    if (res.ok) {
      setApplications((apps) =>
        apps.map((app) =>
          app.trainingId === trainingId ? { ...app, status: "withdrawn" } : app
        )
      );
    } else {
      setError("Failed to withdraw application");
    }
    setWithdrawing(null);
  };

  return (
    <div className="container py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      {loading ? (
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
                <div className="font-semibold">Training ID: {app.trainingId}</div>
                <div>Status: <span className="capitalize">{app.status}</span></div>
                <div className="text-xs text-muted-foreground">Applied at: {new Date(app.appliedAt).toLocaleString()}</div>
              </div>
              {app.status === "pending" || app.status === "applied" ? (
                <Button
                  variant="destructive"
                  disabled={withdrawing === app.trainingId}
                  onClick={() => handleWithdraw(app.trainingId)}
                >
                  {withdrawing === app.trainingId ? "Withdrawing..." : "Withdraw"}
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 