import { integer, pgTable, varchar, date, serial } from "drizzle-orm/pg-core";

import { Users } from "../user/Users";
type Status = "active" | "inactive";
export const Trainings = pgTable("trainings", {
  trainingId: serial().primaryKey(),
  headId: integer()
    .references(() => Users.userId)
    .notNull(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  startDate: date().notNull(),
  duration: integer(), // number of weeks/days
  status: varchar({ length: 40 }).$type<Status>().notNull().default("active"),
});
