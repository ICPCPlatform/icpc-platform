CREATE TABLE "reset_password" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"token" char(25)
);
--> statement-breakpoint
ALTER TABLE "reset_password" ADD CONSTRAINT "reset_password_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE cascade;