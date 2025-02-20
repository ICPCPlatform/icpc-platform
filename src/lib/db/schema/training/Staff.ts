import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { Users } from "../user/Users";
import { Trainings } from "./Trainings";

export const Staff = pgTable(
  "staff",
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

    mentor: boolean().default(false),
    problemSetter: boolean().default(false),
    instructor: boolean().default(false),
    coHead: boolean().default(false),
    coach: boolean().default(false),
    deleted: timestamp(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.trainingId],
      name: "staff_pk",
    }),
  }),
);
