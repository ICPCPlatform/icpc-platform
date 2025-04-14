// implement the blocks table
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import {Trainings} from "@/lib/db/schema/training/Trainings";

export const Blocks = pgTable(
  "blocks",
  {
    blockId: serial().primaryKey(),
    trainingId: integer()
      .references(() => Trainings.trainingId)
      .notNull(),
    blockTitle: varchar({ length: 255 }).notNull(),
    blockDescription: varchar({ length: 255 }).notNull(),
  },
);