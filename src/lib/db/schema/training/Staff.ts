import { boolean, integer, pgTable, serial } from "drizzle-orm/pg-core";

import { Users } from "../user/Users";
import { Trainings } from "./Trainings";

export const Staff = pgTable("staff", {
  staffId: serial().primaryKey(),
  userId: integer()
    .references(() => Users.userId)
    .notNull(),
  trainingId: integer()
    .references(() => Trainings.trainingId)
    .notNull(),
  mentor: boolean().default(false),
  coHead: boolean().default(false),
  instructor: boolean().default(false),
  coach: boolean().default(false),
});
