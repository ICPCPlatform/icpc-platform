import { integer, pgTable, serial } from "drizzle-orm/pg-core";

import { Users } from "../user/Users";
import { Trainings } from "./Trainings";

export const Trainees = pgTable("trainees", {
  traineeId: serial().primaryKey(),
  userId: integer()
    .references(() => Users.userId)
    .notNull(),
  trainingId: integer()
    .references(() => Trainings.trainingId)
    .notNull(),
});
