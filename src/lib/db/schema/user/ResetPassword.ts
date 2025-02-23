import { char, pgTable, uuid } from "drizzle-orm/pg-core";


const ResetPassword = pgTable("reset_password", {
  userId: uuid().primaryKey().references(() => Users.userId, {
    onDelete: "cascade",
    onUpdate: "cascade
  }),
  token: char({ length: 25 }),

})
