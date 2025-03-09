import {
  integer,
  pgTable,
  varchar,
  date,
  serial,
  uuid,
  timestamp,
  json,
} from "drizzle-orm/pg-core";

import { Users } from "../user/Users";
import { citext } from "@/lib/db/util";
import {Materials} from "./Materials";
type Status = "active" | "inactive";


export const Trainings = pgTable("trainings", {
  // TODO make serial start from 1000
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
  materialId: integer().references(()=>Materials.id).notNull(),
  standing: json(),
  standingView: json(),// saves which attributes of standing are visible to trainees 
  startDate: date().notNull(),
  duration: integer().notNull().default(1), // number of weeks/days
  status: varchar({ length: 20 }).$type<Status>().notNull().default("active"),
  deleted: timestamp(),
});
