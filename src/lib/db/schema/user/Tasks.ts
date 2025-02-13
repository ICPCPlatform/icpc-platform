import {
  varchar,
  integer,
  pgTable,
  serial,
  timestamp,
  foreignKey,
} from "drizzle-orm/pg-core";

import { Trainees } from "../training/Trainees";
import { Staff } from "../training/Staff";

type States = "pending" | "in_progress" | "done" | "deleted";
export const Tasks = pgTable(
  "tasks",
  {
    taskId: serial().primaryKey(),
    title: varchar().notNull(),
    description: varchar().notNull(),
    trainingId: integer().default(0),
    traineeId: integer().notNull(),
    staffId: integer().notNull(),
    state: varchar({ length: 40 }).$type<States>().notNull().default("pending"),
    creationTime: timestamp().defaultNow(),
    deadline: timestamp().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.traineeId, table.trainingId],
      foreignColumns: [Trainees.userId, Trainees.trainingId],
    }),
    foreignKey({
      columns: [table.staffId, table.trainingId],
      foreignColumns: [Staff.userId, Staff.trainingId],
    }),
  ],
);
