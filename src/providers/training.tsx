"use client";
import { TrainingFullDTO } from "@/lib/types/Training";
import { createContext, useContext } from "react";
const trainingContext = createContext<TrainingFullDTO | null>(null);
export default function TrainingProvider({
  children,
  trainingData,
}: {
  children: React.ReactNode;
  trainingData: TrainingFullDTO ;
}) {
  return <trainingContext.Provider value={trainingData}>{children}</trainingContext.Provider>;
}
export function useTrainingContext() {
  return useContext(trainingContext);
}
