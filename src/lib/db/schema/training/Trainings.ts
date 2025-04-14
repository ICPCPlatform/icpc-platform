import {
  integer,
  pgTable,
  varchar,
  date,
  serial,
  uuid,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

import { Users } from "../user/Users";
import { citext } from "@/lib/db/util";
import { StandingEntry } from "@/lib/types/Training";

type Status = "active" | "roadmap" | "private" | "over";

type StandingView =
  | "name"
  | "cfhandle"
  | "vjudge"
  | "gmail"
  | "numberofsolved"
  | "points"
  | "mentor"
  | "level"
  | "university"
  | "facutly";

/**
 * Trainings is the table that holds the training information
 */
export const Trainings = pgTable("trainings", {
  trainingId: serial().primaryKey(),
  headId: uuid()
    .references(() => Users.userId, {
      onDelete: "restrict",
      onUpdate: "cascade",
    })
    .notNull(),

  chiefJudge: uuid()
    .references(() => Users.userId, {
      onDelete: "restrict",
      onUpdate: "cascade",
    })
    .notNull(),

  title: citext({ length: 128 }).notNull().unique(),
  description: varchar({ length: 512 }).notNull(),
  material: jsonb(), // this should get Deleted
  standing: jsonb().$type<StandingEntry>(),
  /// saves which attributes of standing are visible to trainees
  standingView: jsonb()
    .notNull()
    .default(["name", "handle", "numberofsolved", "mentor", "level"])
    .$type<StandingView[]>(),
  startDate: date().notNull(),
  duration: integer().notNull().default(1), // number of weeks/days
  status: varchar({ length: 20 }).$type<Status>().default("private").notNull(),
  deleted: timestamp(),
});
