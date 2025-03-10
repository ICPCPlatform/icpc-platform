import { integer, jsonb, pgTable } from "drizzle-orm/pg-core";

export const TrainingView = pgTable("training_view", {
  trainingId: integer().primaryKey(),
  data: jsonb()
    .notNull()
    .default("['name', 'handle', 'numberofsolved', 'mentor', 'level']"),
});
