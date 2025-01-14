import {
    integer,
    pgTable,
    varchar,
} from "drizzle-orm/pg-core";
import{
    Users
} from "./Users";

export const UsersSocials = pgTable("users_socials", {
    userId: integer().primaryKey().references(()=>Users.userId),
    facebook: varchar(),// link to facebook profile
    linkedIn: varchar(),// link to linkedIn profile
    twitter: varchar(), // link to twitter profile
    github: varchar() //   link to github profile
});