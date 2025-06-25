import { getTrainingFullData } from "@/dao/getTrainingFullData";
import React from "react";

export default async function TrainingOverviewPage({ params }: { params: Promise<{ trainingId: string }> }) {
  const { trainingId } = await params;
  const trainingIdNumber = Number(trainingId);
  const trainingData = await getTrainingFullData({ trainingId: trainingIdNumber });

  // Placeholder for announcements/summary
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Training Overview</h2>
      <p className="mb-4 text-muted-foreground">Welcome to your training hub! Here you can find announcements, a summary, and quick links to all sections.</p>
      <div className="mb-6">
        <div className="font-semibold">Summary</div>
        <ul className="list-disc ml-6 mt-2">
          <li>{trainingData.blocks.length} blocks in this training</li>
          <li>{trainingData.leaderboard.length} participants</li>
          {/* Example: "2 new contests this week" - can be enhanced later */}
        </ul>
      </div>
      <div className="mb-6">
        <div className="font-semibold">Announcements</div>
        <div className="italic text-muted-foreground">No announcements yet.</div>
      </div>
      {/* Role-based action buttons can be added here in the future */}
    </div>
  );
} 