import { TrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";

export interface TrainingMatch {
  trainingId: number;
  userId: string;
}

export function extractTrainingId(pathname: string): number | null {

  const PATH_REGEX = /^\/protected\/trainings\/(?<trainingId>\d+)\/.*$/
  const match = pathname.match(PATH_REGEX);
  if (match === null ) {
    return null;
  }
  
  const trainingId = Number(match.groups?.trainingId ?? "NaN");
  if(isNaN(trainingId)){
    return null;
  }

  return trainingId;
}
// Function to extract training ID from URL if it matches a training path

export async function userTrainingPermissions({ trainingId, userId }: TrainingMatch): Promise<TrainingPermissions[]> {
  const AUTH_API_URL = 'http://localhost:3000/api/auth/access-control/trainings';
  
  try {
    const response = await fetch(AUTH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trainingId, userId }),
    });
    
    if (!response.ok) return [];
    
    
    const permissions = await response.json() as TrainingPermissions[];
    return permissions;
  } catch (error) {
    console.error("Failed to check training access:", error);
    return [];
  }
} 