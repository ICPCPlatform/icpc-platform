import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { citext } from "@/lib/db/util";

export const Departments = pgTable("departments", {
  departmentId: serial().primaryKey(),
  departmentName: citext({ length: 60 }).notNull().unique(),
});
