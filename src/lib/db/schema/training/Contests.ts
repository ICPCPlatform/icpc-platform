import {
  primaryKey,
  timestamp,
  integer,
  pgTable,
  varchar,
  foreignKey,
} from "drizzle-orm/pg-core";

import { Blocks } from "./Blocks";

export const Contests = pgTable(
  "contests",
  {
    trainingId: integer().notNull(),
    blockNumber: integer().notNull(),
    contestId: varchar({ length: 32 }).notNull(),

    groupId: varchar({ length: 32 }), // if group contest either codeforces or vjudge could be null

    judge: varchar({ length: 32 }).notNull(), // cf or vjudge
    type: varchar({ length: 32 }).notNull(), // practice or contest => for points calculation
    title: varchar({ length: 128 }).notNull(),
    description: varchar({ length: 512 }).default("").notNull(),

    pointPerProblem: integer().default(20).notNull(),
    firstPoints: integer().default(1000).notNull(),
    calcSys: varchar({ length: 32 }).default("90%").notNull(),
    date: timestamp().defaultNow().notNull(),
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
  ]
);
