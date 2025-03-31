import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  index,
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

    mentor: boolean().default(false).notNull(),
    problemSetter: boolean().default(false).notNull(),
    instructor: boolean().default(false).notNull(),
    coHead: boolean().default(false).notNull(),
    manager: boolean().default(false).notNull(),
    deleted: timestamp(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.trainingId],
      name: "staff_pk",
    }),
    index("mentor_idx").on(table.mentor),
  ]
);
