import {integer, pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {Blocks} from "@/lib/db/schema/training/block/blocks";
import {Trainings} from "@/lib/db/schema/training/Trainings";

export const Contests = pgTable("contests", {
    contestId: serial().primaryKey(),
    blockId: integer()
        .references(() => Blocks.blockId)
        .notNull(),
    trainingId: integer()
        .references(() => Trainings.trainingId)
        .notNull(),
    judge: varchar({ length: 255 }).notNull(),
    type : varchar({ length: 255 }).notNull(),
    pointSpp: integer().notNull(),
    firstPoints : integer().notNull(),
    calcSystem: integer().notNull(),
    contestTitle: varchar({ length: 255 }).notNull(),
    contestDescription: varchar({ length: 255 }).notNull(),
});