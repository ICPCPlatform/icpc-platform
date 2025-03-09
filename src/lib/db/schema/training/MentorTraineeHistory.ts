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
import { Trainees } from "./Trainees";

export const MentorTraineeHistory = pgTable(
  "mentorTraineeHistory",
  {
    mentorId: uuid()
      .references(() => Staff.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    traineeid: uuid()
      .references(() => Users.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",  
      }).notNull(),
    trainingId: integer()
      .references(() => Trainings.trainingId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    startDate: timestamp(),
    endDate: timestamp(),
  },
  (table) => [
    primaryKey({ columns: [table.trainingId,table.mentorId, table.trainingId] }),
    foreignKey({
      columns: [table.mentorId, table.trainingId],
      foreignColumns: [Staff.userId, Staff.trainingId],
    }),foreignKey({
      columns: [table.traineeid, table.trainingId],
      foreignColumns: [Trainees.userId, Trainees.trainingId],
    }),
  ],
);
