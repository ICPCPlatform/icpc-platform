import {
    integer,
    pgTable,
    varchar,
    char,
    date,
    serial,
} from "drizzle-orm/pg-core";

import{
    Users
} from "../user/Users";
import{
    training_state
}   from "../enums";

export const Trainings = pgTable("trainings", {
    trainingId: serial().primaryKey(),
    headId: integer().references(()=>Users.userId).notNull(),
    title: varchar().notNull(),
    description: varchar().notNull(),
    startDate: date().notNull(),
    duration: integer(),// number of weeks/days
    status: training_state(),
});
