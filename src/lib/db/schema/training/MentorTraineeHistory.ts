import {
  integer,
  pgTable,
  primaryKey,
  uuid,
  timestamp,
  foreignKey,
} from "drizzle-orm/pg-core";

import { Trainings } from "./Trainings";
import { Staff } from "./Staff";
import { Trainees } from "./Trainees";

/**
 * Represents the historical records of mentor and trainee relationships within a specific training session.
 * This table keeps track of which mentor was assigned to which trainee and in which training,
 * along with the duration of the mentorship.
 */
export const MentorTraineeHistory = pgTable(
  "mentor_trainee_history",
  {
    mentorId: uuid().notNull(),

    traineeId: uuid().notNull(),

     // Identifier of the training session in which the mentorship took place.
    trainingId: integer()
      .references(() => Trainings.trainingId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    // Timestamp marking the start of the mentorship relationship.
    startDate: timestamp(),

    // Timestamp marking the end of the mentorship relationship.
    // If null, it indicates that the training is still ongoing.
    
    endDate: timestamp(),
  },
  (table) => [
     // Primary key ensuring unique mentor-trainee-training relationships.
    primaryKey({
      columns: [table.trainingId, table.mentorId, table.traineeId],
    }),

    foreignKey({
      columns: [table.mentorId, table.trainingId],
      foreignColumns: [Staff.userId, Staff.trainingId],
    }),

    foreignKey({
      columns: [table.traineeId, table.trainingId],
      foreignColumns: [Trainees.userId, Trainees.trainingId],
    }),
  ]
);
