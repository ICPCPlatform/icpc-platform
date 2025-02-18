import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { citext } from "@/lib/db/util";

export const Communities = pgTable("communities", {
  communityId: serial().primaryKey(),
  communityName: citext({ length: 60 }).notNull().unique(),
});
