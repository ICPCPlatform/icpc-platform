import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Departments = pgTable("departments", {
  departmentId: serial().primaryKey(),
  departmentName: varchar({ length: 60 }).notNull().unique(),
});
