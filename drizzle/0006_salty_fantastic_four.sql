CREATE TABLE "applications" (
	"application_id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"training_id" integer NOT NULL,
	"status" varchar(20),
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"description" varchar(512) NOT NULL,
	CONSTRAINT "applications_userId_trainingId_unique" UNIQUE("user_id","training_id")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE cascade ON UPDATE cascade;