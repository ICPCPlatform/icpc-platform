import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Communities = pgTable("communities", {
  communityId: serial().primaryKey(),
  communityName: varchar({ length: 60 }).notNull().unique(),
});
