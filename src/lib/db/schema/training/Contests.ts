import {
  primaryKey,
  timestamp,
  integer,
  pgTable,
  varchar,
  foreignKey,
} from "drizzle-orm/pg-core";

import { Blocks } from "./Blocks";

/**
 * Contests is the table that holds the contests for a training
 */
export const Contests = pgTable(
  "contests",
  {
    trainingId: integer().notNull(),
    // reference ./Blocks.ts -> Blocks.blockNumber
    blockNumber: integer().notNull(),
    contestId: varchar({ length: 128 }).notNull(),

    groupId: varchar({ length: 128 }).notNull(), // codeforces or vjudge group

    judge: varchar({ length: 128 }).notNull(), // cf or vjudge
    type: varchar({ length: 128 }).notNull(), // practice or contest => for points calculation
    title: varchar({ length: 128 }).notNull(),
    description: varchar({ length: 512 }).notNull(),

    pointPerProblem: integer().notNull(),

    firstPoints: integer().notNull(),
    calcSys: varchar({ length: 128 }).notNull(),
    date: timestamp().notNull(),
    deleted: timestamp(),
  },
  (table) => [
    primaryKey({
      name: "Contest_pkey",
      columns: [table.blockNumber, table.trainingId, table.contestId],
    }),
    foreignKey({
      columns: [table.trainingId, table.blockNumber],
      foreignColumns: [Blocks.trainingId, Blocks.blockNumber],
    }),
  ],
);
