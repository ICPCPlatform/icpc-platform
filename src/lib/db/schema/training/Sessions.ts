import {
  timestamp,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

import { Trainings } from "./Trainings";

export const Sessions = pgTable("sessions", {
  // 32 bits => (8 bits weeknumber + 24 bits pseudo-random number)
  sessionId: integer().primaryKey(),
  trainingId: serial()
    .references(() => Trainings.trainingId)
    .notNull(),
  dateTime: timestamp().notNull(),
  title: varchar().notNull(),
  description: varchar().notNull(),
});
