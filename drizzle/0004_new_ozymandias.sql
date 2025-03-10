CREATE TABLE "Blocks" (
	"training_id" integer NOT NULL,
	"block_number" integer NOT NULL,
	"title" varchar(128) NOT NULL,
	"description" varchar(512) NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"deleted" timestamp,
	CONSTRAINT "block_pkey" PRIMARY KEY("block_number","training_id")
);
--> statement-breakpoint
CREATE TABLE "contests" (
	"training_id" integer NOT NULL,
	"block_number" integer NOT NULL,
	"contest_id" varchar(128) NOT NULL,
	"group_id" varchar(128) NOT NULL,
	"judge" varchar(128) NOT NULL,
	"type" varchar(128) NOT NULL,
	"title" varchar(128) NOT NULL,
	"description" varchar(512) NOT NULL,
	"point_per_problem" integer NOT NULL,
	"first_points" integer NOT NULL,
	"calc_sys" varchar(128) NOT NULL,
	"date" timestamp NOT NULL,
	"deleted" timestamp,
	CONSTRAINT "Contest_pkey" PRIMARY KEY("block_number","training_id","contest_id")
);
--> statement-breakpoint
CREATE TABLE "mentorTraineeHistory" (
	"mentor_id" uuid NOT NULL,
	"trainee_id" uuid NOT NULL,
	"training_id" integer NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	CONSTRAINT "mentorTraineeHistory_training_id_mentor_id_trainee_id_pk" PRIMARY KEY("training_id","mentor_id","trainee_id")
);
--> statement-breakpoint
DROP TABLE "sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "staff" RENAME COLUMN "coach" TO "manager";--> statement-breakpoint
ALTER TABLE "trainings" ADD COLUMN "material" json;--> statement-breakpoint
ALTER TABLE "trainings" ADD COLUMN "standing" json;--> statement-breakpoint
ALTER TABLE "trainings" ADD COLUMN "standing_view" json;--> statement-breakpoint
ALTER TABLE "Blocks" ADD CONSTRAINT "Blocks_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contests" ADD CONSTRAINT "contests_training_id_block_number_Blocks_training_id_block_number_fk" FOREIGN KEY ("training_id","block_number") REFERENCES "public"."Blocks"("training_id","block_number") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorTraineeHistory" ADD CONSTRAINT "mentorTraineeHistory_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mentorTraineeHistory" ADD CONSTRAINT "mentorTraineeHistory_mentor_id_training_id_staff_user_id_training_id_fk" FOREIGN KEY ("mentor_id","training_id") REFERENCES "public"."staff"("user_id","training_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorTraineeHistory" ADD CONSTRAINT "mentorTraineeHistory_trainee_id_training_id_trainees_user_id_training_id_fk" FOREIGN KEY ("trainee_id","training_id") REFERENCES "public"."trainees"("user_id","training_id") ON DELETE no action ON UPDATE no action;