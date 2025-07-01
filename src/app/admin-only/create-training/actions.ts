"use server";
import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { createTrainingSchema } from "@/lib/validation/training/createTraining";
import { getUserData } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { Users } from "@/lib/db/schema/user/Users";
import { like, eq } from "drizzle-orm";

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
    validatedData.chiefJudgeUsername = validatedData.chiefJudgeUsername === ''? userData.username : validatedData.chiefJudgeUsername; 
    validatedData.headUsername = validatedData.headUsername === ''? userData.username : validatedData.headUsername; 
    // Check if user has admin permissions
    if (userData.role !== "admin") {
      return { success: false, error: "Unauthorized: Admin access required" };
    }
    const { headUsername, chiefJudgeUsername, ...mainData } = validatedData;
    // find headId
    const headSearch = await db
      .select({ userId: Users.userId })
      .from(Users)
      .where(eq(Users.username, headUsername))
      .execute();
    if (headSearch.length === 0) {
      return { success: false, error: "Head judge not found" };
    }
    const headId = headSearch[0].userId;

    // find chiefJudgeId
    const chiefJudgeSearch = await db
      .select({ userId: Users.userId })
      .from(Users)
      .where(eq(Users.username, chiefJudgeUsername))
      .execute();
    if (chiefJudgeSearch.length === 0) {
      return { success: false, error: "Chief judge not found" };
    }
    const chiefJudgeId = chiefJudgeSearch[0].userId;
    const insertData = {
      ...mainData,
      headId: headId,
      chiefJudge: chiefJudgeId,
      startDate: validatedData.startDate.toDateString(),
    } satisfies typeof Trainings.$inferInsert;
    // Insert training into database
    await db.transaction(async (tx) => {
      const { trainingId } = (
        await tx
          .insert(Trainings)
          .values(insertData)
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
}): Promise<{ username: string }[] | null> {
  try {
    const userData = await getUserData();

    if (userData == null || userData.role !== "admin") {
      throw Error("Unautherized access");
    }
    const users = await db
      .select({ username: Users.username })
      .from(Users)
      .where(like(Users.username, `${username}%`))
      .execute();

    return users;
  } catch (error) {
    console.error("Error searching by username:", error);
    throw Error("Error occurred while searching for user");
  }
}
