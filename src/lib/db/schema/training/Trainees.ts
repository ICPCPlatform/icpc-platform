import { integer, pgTable , primaryKey } from "drizzle-orm/pg-core";

import { Users } from "../user/Users";
import { Trainings } from "./Trainings";

export const Trainees = pgTable(
  "trainees",
  {
    userId: integer()
      .references(() => Users.userId)
      .notNull(),
    trainingId: integer()
      .references(() => Trainings.trainingId)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.trainingId] })],
);
