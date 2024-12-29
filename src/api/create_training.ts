"use server";

import { Trainings } from "../util/db/schema/Training";
import { db } from "../util/db/index";

type Training = typeof Trainings.$inferInsert;
export async function createTraining(
  training: Training,
  _user: never | "", // this should be added by the privelages user that create the training
): Promise<void> {

  console.log("Creating Traning"); // can this to the logging system

  await db.insert(Trainings).values(training).execute();
}
