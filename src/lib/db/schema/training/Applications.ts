import {
  integer,
  pgTable,
  uuid,
  timestamp,
  serial,
  varchar,
  unique,
} from "drizzle-orm/pg-core";

import { Users } from "../user/Users";
import { Trainings } from "./Trainings";

/**
 * Applications is the table that holds the applications for a training
 */
export const Applications = pgTable(
  "applications",
  {
    applicationId: serial().primaryKey(),
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
    status: varchar({ length: 20 }),
    appliedAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
    description: varchar({ length: 512 }).notNull(),
  },
  (table) => [unique().on(table.userId, table.trainingId)]
);
