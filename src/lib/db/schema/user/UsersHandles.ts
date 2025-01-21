import {
    integer,
    pgTable,
    varchar,
} from "drizzle-orm/pg-core";

import{
    Users
} from "./Users";

export const UsersHandle = pgTable("users_handle", {
    userId: integer().primaryKey().references(()=>Users.userId),
    // all handles are handles only not links
    vjudge: varchar(), 
    atcoder: varchar(),
    topcoder: varchar(),
    spoj: varchar(),
    codechef: varchar(),
    csacademy: varchar(),
    leetcode: varchar(),
    cses: varchar(),
});
