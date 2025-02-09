import {
  boolean,
  char,
  date,
  integer,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

import { Users } from "./Users";

export const UserFullData = pgTable("users_full_data", {
  userId: integer()
    .primaryKey()
    .references(() => Users.userId),

  /* Academic */
  university: varchar(),
  faculty: varchar(),
  department: varchar(),
  academicYear: date(),
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
  nationalID: char({ length: 14 }).notNull(),
  country: varchar(),
  city: varchar(),
  birthdate: date(),
  isMale: boolean(),
  ImageURL: varchar(),

  /* Socials */
  facebook: varchar(), // link to facebook profile
  linkedIn: varchar(), // link to linkedIn profile
  twitter: varchar(), // link to twitter profile
  github: varchar(), //   link to github profile
});
