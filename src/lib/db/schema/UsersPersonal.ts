import {
    integer,
    pgTable,
    varchar,
    char,
    date,
} from "drizzle-orm/pg-core";

import{
    Users
} from "./Users";
import{
    gender_type
}   from "./enums";

export const UsersPersonal = pgTable("users_personal", {
    userId: integer().primaryKey().references(()=>Users.userId),

    nameEnFirst: varchar(), // first name in English
    nameEnLast: varchar(), // second name in English
    nameAR1: varchar(),
    nameAR2: varchar(),
    nameAR3: varchar(),
    nameAR4: varchar(),
    nationalID: char({ length: 14 }).notNull(),
    country: varchar(),
    city: varchar(),
    birthdate: date(),
    gender: gender_type(),
    ImageURL: varchar(),
});
