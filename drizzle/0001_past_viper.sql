ALTER TABLE "mentor_trainee_history" DROP CONSTRAINT "mentor_trainee_history_training_id_mentor_id_trainee_id_pk";--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "contest_id" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "group_id" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "group_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "judge" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "type" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "point_per_problem" SET DEFAULT 20;--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "first_points" SET DEFAULT 1000;--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "calc_sys" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "calc_sys" SET DEFAULT '90%';--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "mentor_trainee_history" ALTER COLUMN "start_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mentor_trainee_history" ALTER COLUMN "end_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "mentor_trainee_history" ALTER COLUMN "end_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "mentor" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "problem_setter" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "instructor" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "co_head" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "manager" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "trainees" ALTER COLUMN "mentor_assigned_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "trainings" ALTER COLUMN "material" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "trainings" ALTER COLUMN "standing" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "trainings" ALTER COLUMN "standing_view" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "trainings" ALTER COLUMN "standing_view" SET DEFAULT '["name","handle","numberofsolved","mentor","level"]'::jsonb;--> statement-breakpoint
ALTER TABLE "mentor_trainee_history" ADD CONSTRAINT "mentor_trainee_history_training_id_mentor_id_trainee_id_end_date_pk" PRIMARY KEY("training_id","mentor_id","trainee_id","end_date");--> statement-breakpoint
CREATE INDEX "mentor_idx" ON "staff" USING btree ("mentor");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");