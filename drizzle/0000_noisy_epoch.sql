CREATE TABLE "attendance_logs" (
	"attendance_log_id" serial PRIMARY KEY NOT NULL,
	"staff_id" integer NOT NULL,
	"trainee_id" integer NOT NULL,
	"training_id" integer NOT NULL,
	"session_id" integer NOT NULL,
	"log_type" varchar(40) NOT NULL,
	"log_time" timestamp DEFAULT now(),
	"log_remarks" varchar
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_id" integer PRIMARY KEY NOT NULL,
	"training_id" serial NOT NULL,
	"date_time" timestamp NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"staff_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"training_id" integer NOT NULL,
	"mentor" boolean DEFAULT false,
	"co_head" boolean DEFAULT false,
	"instructor" boolean DEFAULT false,
	"coach" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "trainees" (
	"trainee_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"training_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trainings" (
	"training_id" serial PRIMARY KEY NOT NULL,
	"head_id" integer NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"start_date" date NOT NULL,
	"duration" integer,
	"status" varchar(40) DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"task_id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"training_id" integer DEFAULT 0,
	"trainee_id" integer NOT NULL,
	"staff_id" integer NOT NULL,
	"state" varchar(40) DEFAULT 'pending' NOT NULL,
	"creation_time" timestamp DEFAULT now(),
	"deadline" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"password" varchar NOT NULL,
	"gmail" varchar NOT NULL,
	"cf_handle" varchar NOT NULL,
	"phone_number" char(11) NOT NULL,
	"role" varchar(40) DEFAULT 'user' NOT NULL,
	"last_online" timestamp DEFAULT now(),
	"is_verified" boolean DEFAULT false NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_gmail_unique" UNIQUE("gmail")
);
--> statement-breakpoint
CREATE TABLE "users_academic" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"university" varchar,
	"faculty" varchar,
	"department" varchar,
	"academic_year" date,
	"graduation_year" date,
	"vjudge" varchar,
	"atcoder" varchar,
	"topcoder" varchar,
	"spoj" varchar,
	"codechef" varchar,
	"csacademy" varchar,
	"leetcode" varchar,
	"cses" varchar,
	"name_en_first" varchar,
	"name_en_last" varchar,
	"name_ar_1" varchar,
	"name_ar_2" varchar,
	"name_ar_3" varchar,
	"name_ar_4" varchar,
	"national_id" char(14) NOT NULL,
	"country" varchar,
	"city" varchar,
	"birthdate" date,
	"is_male" boolean,
	"image_url" varchar,
	"facebook" varchar,
	"linked_in" varchar,
	"twitter" varchar,
	"github" varchar
);
--> statement-breakpoint
ALTER TABLE "attendance_logs" ADD CONSTRAINT "attendance_logs_staff_id_staff_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("staff_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_logs" ADD CONSTRAINT "attendance_logs_trainee_id_trainees_trainee_id_fk" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainees"("trainee_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_logs" ADD CONSTRAINT "attendance_logs_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_logs" ADD CONSTRAINT "attendance_logs_session_id_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("session_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainees" ADD CONSTRAINT "trainees_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainees" ADD CONSTRAINT "trainees_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_head_id_users_user_id_fk" FOREIGN KEY ("head_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_trainee_id_trainees_trainee_id_fk" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainees"("trainee_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_staff_id_staff_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("staff_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_academic" ADD CONSTRAINT "users_academic_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;