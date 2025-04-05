import {
  primaryKey,
  timestamp,
  integer,
  pgTable,
  varchar,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

import { Trainings } from "./Trainings";

/**
 * block is the smallest unit of a training
 */
export const Blocks = pgTable(
  "blocks",
  {
    trainingId: integer()
      .references(() => Trainings.trainingId)
      .notNull(),

    // blockNumber is the 0 - training.duration
    // where 0 is the default block for the training
    // and training.duration is the final block
    blockNumber: integer().notNull(),

    title: varchar({ length: 128 }).notNull(),

    description: varchar({ length: 512 }).notNull(),

    hidden: boolean().default(false).notNull(),

    date: timestamp().defaultNow().notNull(),

    material: jsonb().default([]).notNull(),

    deleted: timestamp(),
  },
  (table) => [
    primaryKey({
      name: "block_pkey",
      columns: [table.blockNumber, table.trainingId],
    }),
  ],
);
