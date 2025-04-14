import {
  boolean,
  char,
  date,
  integer,
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { Users } from "./Users";
import { Cities } from "./Cities";
import { Departments } from "./Departments";
import { Faculties } from "./Faculties";
import { Institutes } from "./Institutes";
import { Countries } from "./Countries";
import { Communities } from "./Communities";
import { citext } from "@/lib/db/util";

export const UsersFullData = pgTable("users_full_data", {
  userId: uuid()
    .primaryKey()
    .references(() => Users.userId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  /* Academic */
  instituteId: integer().references(() => Institutes.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  facultyId: integer().references(() => Faculties.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  departmentId: integer().references(() => Departments.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  communityId: integer().references(() => Communities.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  academicYear: integer(),
  graduationDate: date(),

  /* handles */
  atcoder: citext(),
  codechef: citext(),
  leetcode: citext(),
  cses: citext(),

  /* Personal */
  firstNameEn: varchar({ length: 20 }),
  lastNameEn: varchar({ length: 20 }),
  nameAR1: varchar({ length: 20 }),
  nameAR2: varchar({ length: 20 }),
  nameAR3: varchar({ length: 20 }),
  nameAR4: varchar({ length: 20 }),
  nationalId: char({ length: 14 }).unique(), // EG
  countryId: integer().references(() => Countries.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  cityId: integer().references(() => Cities.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  isMale: boolean(),
  imageUrl: varchar({ length: 255 }),
  whatsappPhoneNumber: varchar({ length: 15 }),
  /* Socials */
  facebook: varchar({ length: 128 }), // facebook link||id to profile
  linkedIn: varchar({ length: 30 }), // linkedin username 29 mx length
  twitter: varchar({ length: 16 }), // twitter username  15 mx length
  github: varchar({ length: 40 }), // github username   39 mx length
  telegram: varchar({ length: 32 }), // telegram username

  /* server stuff */
  visibilityMask: integer().default(0), // 1 means hide field
  registrationDate: timestamp().defaultNow(),
});

// TODO make sure all key components her are in it's ZOD verification
// ype k = keyof typeof UsersFullData.$inferInsert;
