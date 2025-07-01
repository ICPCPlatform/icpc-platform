ALTER TABLE "applications" DROP CONSTRAINT "applications_userId_trainingId_unique";--> statement-breakpoint
ALTER TABLE "trainings" ALTER COLUMN "standing_view" SET DEFAULT '["username","name","handle","numberofsolved","mentor","level"]'::jsonb;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_training_id_pk" PRIMARY KEY("user_id","training_id");--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "application_id";
