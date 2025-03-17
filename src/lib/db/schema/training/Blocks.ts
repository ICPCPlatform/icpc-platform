import {
  primaryKey,
  timestamp,
  integer,
  pgTable,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

import { Trainings } from "./Trainings";

export const Blocks = pgTable(
  "blocks",
  {
    trainingId: integer()
      .references(() => Trainings.trainingId)
      .notNull(),
    blockNumber: integer().notNull(),
    title: varchar({ length: 128 }).notNull(),
    description: varchar({ length: 512 }).notNull(),
    hidden: boolean().default(false).notNull(),
    date: timestamp().defaultNow().notNull(),
    deleted: timestamp(),
  },
  (table) => [
    primaryKey({
      name: "block_pkey",
      columns: [table.blockNumber, table.trainingId],
    }),
  ]
);
