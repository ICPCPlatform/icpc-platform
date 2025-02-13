import {
  boolean,
  char,
  date,
  integer,
  pgTable,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

import { Users } from "./Users";

export const UsersFullData = pgTable(
  "users_full_data",
  {
    userId: integer()
      .primaryKey()
      .references(() => Users.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    username: varchar()
      .notNull()
      .references(() => Users.username, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    cfHandle: varchar()
      .notNull()
      .references(() => Users.cfHandle, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),

    /* Academic */
    university: varchar(),
    faculty: varchar(),
    department: varchar(),
    academicYear: integer(),
    graduationYear: date(),

    /* handles */
    vjudge: varchar(),
    atcoder: varchar(),
    topcoder: varchar(),
    spoj: varchar(),
    codechef: varchar(),
    csacademy: varchar(),
    leetcode: varchar(),
    cses: varchar(),

    /* Personal */
    nameEnFirst: varchar(),
    nameEnLast: varchar(),
    nameAR1: varchar(),
    nameAR2: varchar(),
    nameAR3: varchar(),
    nameAR4: varchar(),
    nationalID: char({ length: 14 }),
    country: varchar(),
    city: varchar(),
    isMale: boolean(),
    imageURL: varchar(),

    /* Socials */
    facebook: varchar(), // link to facebook profile
    linkedIn: varchar(), // link to linkedIn profile
    twitter: varchar(), // link to twitter profile
    github: varchar(), //   link to github profile
  },
  (table) => [uniqueIndex("users_full_data_username_idx").on(table.username)],
);
