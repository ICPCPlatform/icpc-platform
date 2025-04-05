"use client";
import { TrainingFullData } from "@/lib/types/Training";
import { createContext, useContext } from "react";
const trainingContext = createContext<TrainingFullData | null>(null);
export default function TrainingProvider({
  children,
  trainingData,
}: {
  children: React.ReactNode;
  trainingData: TrainingFullData ;
}) {
  return <trainingContext.Provider value={trainingData}>{children}</trainingContext.Provider>;
}
export function useTrainingContext() {
  return useContext(trainingContext);
}
