import {
  foreignKey,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { Staff } from "./Staff";
import { Trainees } from "./Trainees";
import { Sessions } from "./Sessions";
type logType = "checkin" | "checkout";

export const AttendanceLogs = pgTable(
  "attendance_logs",
  {
    attendanceLogId: serial().primaryKey(),
    staffId: integer()
      .notNull(),
    traineeId: integer()
      .notNull(),
    trainingId: integer()
      .notNull(),
    sessionId: integer()
      .references(() => Sessions.sessionId)
      .notNull(),

    logType: varchar({ length: 40 }).$type<logType>().notNull(),
    logTime: timestamp().defaultNow(),
    logRemarks: varchar(),
  },
  (table) => [
    foreignKey({
      columns: [table.traineeId, table.trainingId],
      foreignColumns: [Trainees.userId, Trainees.trainingId],
      name: "fk_attendance_trainees",
    }),
    foreignKey({
      columns: [table.staffId, table.trainingId],
      foreignColumns: [Staff.userId, Staff.trainingId],
      name: "fk_attendance_staff",
    }),
  ],
);
