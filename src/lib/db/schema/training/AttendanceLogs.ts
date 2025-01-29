import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { Staff } from "./Staff";
import { Trainees } from "./Trainees";
import { Trainings } from "./Trainings";
import { Sessions } from "./Sessions";
type logType = "checkin" | "checkout";

export const AttendanceLogs = pgTable("attendance_logs", {
  attendanceLogId: serial().primaryKey(),
  staffId: integer()
    .references(() => Staff.staffId)
    .notNull(),
  traineeId: integer()
    .references(() => Trainees.traineeId)
    .notNull(),
  trainingId: integer()
    .references(() => Trainings.trainingId)
    .notNull(),
  sessionId: integer()
    .references(() => Sessions.sessionId)
    .notNull(),

  logType: varchar({ length: 40 }).$type<logType>().notNull(),
  logTime: timestamp().defaultNow(),
  logRemarks: varchar(),
});
