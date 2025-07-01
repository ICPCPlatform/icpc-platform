import { pgTable, serial } from "drizzle-orm/pg-core";
import { citext } from "@/lib/db/schema/util";

export const Communities = pgTable("communities", {
  id: serial().primaryKey(),
  name: citext({ length: 60 }).notNull().unique(),
});
