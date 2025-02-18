import {
  integer,
  pgTable,
  primaryKey,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

import { Users } from "../user/Users";
import { Trainings } from "./Trainings";
import { Staff } from "./Staff";
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
    mentorId: uuid().references(() => Staff.userId, {
      onDelete: "set null",
      onUpdate: "set null",
    }),
    mentor_assigned_date: timestamp().defaultNow(),
    deleted: timestamp(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.trainingId] })],
);
