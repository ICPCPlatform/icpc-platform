import { pgTable, varchar, date, serial } from "drizzle-orm/pg-core";

export const Trainings = pgTable("trainings", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  description: varchar().notNull(),
  startDate: date().notNull(),
  endDate: date().notNull(),
});
