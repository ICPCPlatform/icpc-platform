"use server";

import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { createTrainingSchema } from "@/lib/validation/training/createTraining";
import { getUserData } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function createTrainingAction(formData: z.infer<typeof createTrainingSchema>) {
  try {
    // Validate data
    const validatedData = createTrainingSchema.parse(formData);
    
    // Get current user data
    const userData = await getUserData();
    if (!userData) {
      throw new Error("User not authenticated");
    }
    
    // Check if user has admin permissions
    if (userData.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    // Define the training data according to the schema
    const trainingData = {
      title: validatedData.title,
      description: validatedData.description,
      headId: validatedData.headId,
      chiefJudge: validatedData.chiefJudge,
      startDate: validatedData.startDate,
      duration: validatedData.duration,
      status: validatedData.status,
      standingView: validatedData.standingView,
    };

    // Insert training into database
    const result = await db.insert(Trainings)
      .values(trainingData)
      .returning({ trainingId: Trainings.trainingId })
      .execute();

    // Revalidate the trainings path to update the UI
    revalidatePath("/protected/trainings");

    // Return success with training ID
    if (result.length > 0) {
      const trainingId = result[0].trainingId;
      return { success: true, trainingId };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error creating training:", error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Validation error", 
        fieldErrors: error.errors 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create training" 
    };
  }
} 