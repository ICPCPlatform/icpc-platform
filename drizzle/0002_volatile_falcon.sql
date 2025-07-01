ALTER TABLE "trainees" RENAME TO "mentor_trainees";--> statement-breakpoint
ALTER TABLE "mentor_trainees" DROP CONSTRAINT "trainees_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "mentor_trainees" DROP CONSTRAINT "trainees_training_id_trainings_training_id_fk";
--> statement-breakpoint
ALTER TABLE "mentor_trainees" DROP CONSTRAINT "trainees_mentor_id_training_id_staff_user_id_training_id_fk";
--> statement-breakpoint
ALTER TABLE "mentor_trainees" DROP CONSTRAINT "trainees_user_id_training_id_mentor_id_pk";--> statement-breakpoint
ALTER TABLE "mentor_trainees" ADD CONSTRAINT "mentor_trainees_user_id_training_id_mentor_id_pk" PRIMARY KEY("user_id","training_id","mentor_id");--> statement-breakpoint
ALTER TABLE "mentor_trainees" ADD CONSTRAINT "mentor_trainees_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mentor_trainees" ADD CONSTRAINT "mentor_trainees_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mentor_trainees" ADD CONSTRAINT "mentor_trainees_mentor_id_training_id_staff_user_id_training_id_fk" FOREIGN KEY ("mentor_id","training_id") REFERENCES "public"."staff"("user_id","training_id") ON DELETE no action ON UPDATE no action;