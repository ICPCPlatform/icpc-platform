import {
  integer,
  pgTable,
  varchar,
  date,
  serial,
  uuid,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { Users } from "../user/Users";

type Status = "active" | "inactive";
export const Trainings = pgTable("trainings", {
  trainingId: serial().primaryKey(),
  headId: uuid()
    .references(() => Users.userId, {
      onDelete: "restrict",
      onUpdate: "cascade",
    })
    .notNull(),
  chiefJudge: uuid()
    .references(() => Users.userId, {
      onDelete: "restrict",
      onUpdate: "cascade",
    })
    .notNull(),
  title: varchar({ length: 128 }).notNull().unique(),
  description: varchar({ length: 512 }).notNull(),
  startDate: date().notNull(),
  duration: integer().notNull().default(1), // number of weeks/days
  status: varchar({ length: 20 }).$type<Status>().notNull().default("active"),
  deleted: timestamp(),
});
