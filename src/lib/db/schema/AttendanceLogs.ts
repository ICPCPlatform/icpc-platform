import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { attendance_log_type } from "./enums";
import { Staff } from "./Staff";
import { Trainees } from "./Trainees";
import { Trainings } from "./Trainings";
import { Sessions } from "./Sessions";

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

  logType: attendance_log_type(),
  logTime: timestamp().defaultNow(),
  logRemarks: varchar(),
});
