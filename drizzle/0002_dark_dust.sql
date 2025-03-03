ALTER TABLE "reset_password" DROP CONSTRAINT "reset_password_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "reset_password" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reset_password" ADD COLUMN "end_at" timestamp DEFAULT now() + interval '1 day';--> statement-breakpoint
ALTER TABLE "reset_password" ADD CONSTRAINT "reset_password_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;