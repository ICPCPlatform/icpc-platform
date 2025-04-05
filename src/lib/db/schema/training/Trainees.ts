import {
  integer,
  pgTable,
  primaryKey,
  uuid,
  timestamp,
  foreignKey,
} from "drizzle-orm/pg-core";

import { Users } from "../user/Users";
import { Trainings } from "./Trainings";
import { Staff } from "./Staff";


/**
 * Trainees is the table that holds the trainees for a training
 */
export const Trainees = pgTable(
  "trainees",
  {
    userId: uuid()
      .references(() => Users.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    trainingId: integer()
      .references(() => Trainings.trainingId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    mentorId: uuid().notNull(),

    mentor_assigned_date: timestamp().defaultNow(),
    deleted: timestamp(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.trainingId] }),
    foreignKey({
      columns: [table.mentorId, table.trainingId],
      foreignColumns: [Staff.userId, Staff.trainingId],
    }),
  ],
);
