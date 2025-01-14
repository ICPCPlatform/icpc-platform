import {
  varchar,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

import { Trainings } from "./Trainings";
import { task_state } from "./enums";
import { Trainees } from "./Trainees";
import { Staff } from "./Staff";
export const Tasks = pgTable("tasks", {
  taskId: serial().primaryKey(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  trainingId: integer().references(() => Trainings.trainingId).default(0),
  traineeId: integer().references(() => Trainees.traineeId).notNull(),
  staffId: integer().references(() => Staff.staffId).notNull(),
  state: task_state(),
  creationTime: timestamp().defaultNow(),
  deadline: timestamp().notNull(),
});
