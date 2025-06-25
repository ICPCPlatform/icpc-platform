"use client";
import { createContext, useContext } from "react";
import { TrainingFlatLeaderboardDTO } from "@/dao/getTrainingFullData";
const trainingContext = createContext<TrainingFlatLeaderboardDTO | null>(null);
export default function TrainingProvider({
  children,
  trainingData,
}: {
  children: React.ReactNode;
  trainingData: TrainingFlatLeaderboardDTO & { userRoles?: string[] };
}) {
  return <trainingContext.Provider value={trainingData}>{children}</trainingContext.Provider>;
}
export function useTrainingContext() {
  return useContext(trainingContext);
}
