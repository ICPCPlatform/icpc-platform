import { pgEnum } from "drizzle-orm/pg-core";

export const role_type = pgEnum("role_type", ["admin", "coach", "user"]);
export const gender_type = pgEnum("gender_type", ["male", "female"]);
export const training_state = pgEnum("training_state", ["active", "inactive"]);
export const task_state = pgEnum("task_state", [
  "pending",
  "in_progress",
  "done",
  "deleted",
]);
export const attendance_log_type = pgEnum("attendance_log_type", ["in", "out"]);
