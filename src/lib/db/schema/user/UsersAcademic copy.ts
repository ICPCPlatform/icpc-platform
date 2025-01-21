import {
    date,
    integer,
    pgTable,
    varchar,
} from "drizzle-orm/pg-core";

import{
    Users
} from "./Users";

export const usersAcademic = pgTable("users_academic", {
    userId: integer().primaryKey().references(()=>Users.userId),
    university: varchar(),
    faculty: varchar(),
    department: varchar(),
    academicYear: date(),
    graduationYear: date(),
});
