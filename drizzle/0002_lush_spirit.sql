ALTER TABLE "mentor_trainee_history" DROP CONSTRAINT "mentor_trainee_history_training_id_mentor_id_trainee_id_end_date_pk";--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "judge" SET DATA TYPE varchar(2);--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "mentor_trainee_history" ALTER COLUMN "end_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "mentor_trainee_history" ALTER COLUMN "end_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mentor_trainee_history" ADD CONSTRAINT "mentor_trainee_history_training_id_mentor_id_trainee_id_start_date_pk" PRIMARY KEY("training_id","mentor_id","trainee_id","start_date");