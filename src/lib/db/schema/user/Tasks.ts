import {
  varchar,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

import { Trainings } from "../training/Trainings";
import { Trainees } from "../training/Trainees";
import { Staff } from "../training/Staff";

type States = "pending"| "in_progress"| "done"| "deleted"
export const Tasks = pgTable("tasks", {
  taskId: serial().primaryKey(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  trainingId: integer()
    .references(() => Trainings.trainingId)
    .default(0),
  traineeId: integer()
    .references(() => Trainees.traineeId)
    .notNull(),
  staffId: integer()
    .references(() => Staff.staffId)
    .notNull(),
  state: varchar({ length: 40 }).$type<States>().notNull().default("pending"),
  creationTime: timestamp().defaultNow(),
  deadline: timestamp().notNull(),
});
