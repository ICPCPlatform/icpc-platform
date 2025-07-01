import { pgView, uuid, integer} from "drizzle-orm/pg-core";
import {  sql } from "drizzle-orm";

export const Trainees = pgView("trainees", {
  userId: uuid('user_id'),
  trainingId: integer('training_id').notNull(),
  updateAt: integer('updated_at').notNull(),
}).as(sql`
  select "user_id", "training_id", "updated_at"
  from "applications" where "applications"."status" = 'accepted'`)
