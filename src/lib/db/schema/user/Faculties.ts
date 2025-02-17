import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Faculties = pgTable("faculties", {
  facultyId: serial().primaryKey(),
  facultyName: varchar({ length: 60 }).notNull().unique(),
});
