import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { citext } from "@/lib/db/util";

export const Faculties = pgTable("faculties", {
  facultyId: serial().primaryKey(),
  facultyName: citext({ length: 60 }).notNull().unique(),
});
