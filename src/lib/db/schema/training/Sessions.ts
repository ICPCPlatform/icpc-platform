import {
  primaryKey,
  timestamp,
  integer,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

import { Trainings } from "./Trainings";

export const Sessions = pgTable(
  "sessions",
  {
    trainingId: integer()
      .references(() => Trainings.trainingId)
      .notNull(),
    weekNumber: integer().notNull(),
    title: varchar({ length: 128 }).notNull(),
    description: varchar({ length: 512 }).notNull(),
    date: timestamp().notNull(),
    deleted: timestamp(),
  },
  (table) => [
    primaryKey({
      name: "sessions_pkey",
      columns: [table.weekNumber, table.trainingId],
    }),
  ]
);
