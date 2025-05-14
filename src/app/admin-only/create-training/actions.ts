"use server";
import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { createTrainingSchema } from "@/lib/validation/training/createTraining";
import { getUserData } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { Users } from "@/lib/db/schema/user/Users";
import { eq } from "drizzle-orm";

export async function createTrainingAction(
  formData: z.infer<typeof createTrainingSchema>,
) {
  try {
    // Validate data
    const validatedData = createTrainingSchema.parse(formData);

    // Get current user data
    const userData = await getUserData();
    if (!userData) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if user has admin permissions
    if (userData.role !== "admin") {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    // Insert training into database
    await db.transaction(async (tx) => {
      const { trainingId } = (
        await tx
          .insert(Trainings)
          .values({
            ...validatedData,
            startDate: validatedData.startDate.toDateString(),
          })
          .returning({ trainingId: Trainings.trainingId })
          .execute()
      )[0];
      for (let i = 0; i <= validatedData.duration; i++) {
        tx.insert(Blocks)
          .values({
            trainingId: trainingId,
            blockNumber: i,
            title: `Block ${i}`,
            description: `Description for block ${i}`,
            hidden: true,
          } satisfies typeof Blocks.$inferInsert)
          .returning({ trainingId: Trainings.trainingId })
          .execute();
      }
    });

    // Revalidate the trainings path to update the UI
    revalidatePath("/protected/trainings");

    // Return success with training ID
    return { success: true };
  } catch (error) {
    console.error("Error creating training:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        fieldErrors: error.errors,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create training",
    };
  }
}

export async function searchByUsername({
  username,
}: {
  username: string;
}): Promise<string | null> {
  try {
    const user = await db
      .select({ userId: Users.userId })
      .from(Users)
      .where(eq(Users.username, username))
      .execute();

    if (user.length === 0) {
      return "User not found";
    }

    return user[0].userId;
  } catch (error) {
    console.error("Error searching by username:", error);
    throw Error("Error occurred while searching for user");
  }
}
