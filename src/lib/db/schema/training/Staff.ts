import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  foreignKey,
  unique,
} from "drizzle-orm/pg-core";

import { Users } from "../user/Users";
import { Trainings } from "./Trainings";

export const Staff = pgTable(
  "staff",
  {
    userId: integer().notNull(),
    trainingId: integer().notNull(),
    mentor: boolean().default(false),
    coHead: boolean().default(false),
    instructor: boolean().default(false),
    coach: boolean().default(false),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.trainingId], name: "staff_pk" }),
    unique().on(table.userId, table.trainingId),
    foreignKey({ columns: [table.userId], foreignColumns: [Users.userId] }),
    foreignKey({
      columns: [table.trainingId],
      foreignColumns: [Trainings.trainingId],
    }),
  ],
);
