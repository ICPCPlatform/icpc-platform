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
CREATE TABLE "staff" (
	"user_id" uuid NOT NULL,
	"training_id" integer NOT NULL,
	"mentor" boolean DEFAULT false,
	"problem_setter" boolean DEFAULT false,
	"instructor" boolean DEFAULT false,
	"co_head" boolean DEFAULT false,
	"manager" boolean DEFAULT false,
	"deleted" timestamp,
	CONSTRAINT "staff_pk" PRIMARY KEY("user_id","training_id")
);
--> statement-breakpoint
CREATE TABLE "trainees" (
	"user_id" uuid NOT NULL,
	"training_id" integer NOT NULL,
	"mentor_id" uuid NOT NULL,
	"mentor_assigned_date" timestamp DEFAULT now(),
	"deleted" timestamp,
	CONSTRAINT "trainees_user_id_training_id_pk" PRIMARY KEY("user_id","training_id")
);
--> statement-breakpoint
CREATE TABLE "training_view" (
	"training_id" integer PRIMARY KEY NOT NULL,
	"data" jsonb   NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trainings" (
	"training_id" serial PRIMARY KEY NOT NULL,
	"head_id" uuid NOT NULL,
	"chief_judge" uuid NOT NULL,
	"title" "citext" NOT NULL,
	"description" varchar(512) NOT NULL,
	"material" json,
	"standing" json,
	"standing_view" json,
	"start_date" date NOT NULL,
	"duration" integer DEFAULT 1 NOT NULL,
	"status" varchar(20) DEFAULT '' NOT NULL,
	"deleted" timestamp,
	CONSTRAINT "trainings_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" "citext" NOT NULL,
	CONSTRAINT "cities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "communities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" "citext" NOT NULL,
	CONSTRAINT "communities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" "citext" NOT NULL,
	CONSTRAINT "countries_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" "citext" NOT NULL,
	CONSTRAINT "departments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "email_auth" (
	"token" varchar NOT NULL,
	"user_id" uuid PRIMARY KEY NOT NULL,
	"expires_at" date DEFAULT now() + interval '7 day' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faculties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" "citext" NOT NULL,
	CONSTRAINT "faculties_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "institutes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" "citext" NOT NULL,
	CONSTRAINT "institutes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "reset_password" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"token" char(25) NOT NULL,
	"end_at" timestamp DEFAULT now() + interval '1 day' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" "citext" NOT NULL,
	"password" varchar NOT NULL,
	"gmail" "citext" NOT NULL,
	"cf_handle" "citext" NOT NULL,
	"vj_handle" "citext",
	"phone_number" varchar(15) NOT NULL,
	"role" varchar(40) DEFAULT 'user' NOT NULL,
	"deleted" timestamp,
	CONSTRAINT "users_gmail_unique" UNIQUE("gmail"),
	CONSTRAINT "users_cfHandle_unique" UNIQUE("cf_handle"),
	CONSTRAINT "users_vjHandle_unique" UNIQUE("vj_handle")
);
--> statement-breakpoint
CREATE TABLE "users_full_data" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"institute_id" integer,
	"faculty_id" integer,
	"department_id" integer,
	"community_id" integer,
	"academic_year" integer,
	"graduation_date" date,
	"atcoder" "citext",
	"codechef" "citext",
	"leetcode" "citext",
	"cses" "citext",
	"first_name_en" varchar(20),
	"last_name_en" varchar(20),
	"name_ar_1" varchar(20),
	"name_ar_2" varchar(20),
	"name_ar_3" varchar(20),
	"name_ar_4" varchar(20),
	"national_id" char(14),
	"country_id" integer,
	"city_id" integer,
	"is_male" boolean,
	"image_url" varchar(255),
	"whatsapp_phone_number" varchar(15),
	"facebook" varchar(128),
	"linked_in" varchar(30),
	"twitter" varchar(16),
	"github" varchar(40),
	"telegram" varchar(32),
	"visibility_mask" integer DEFAULT 0,
	"registration_date" timestamp DEFAULT now(),
	CONSTRAINT "users_full_data_nationalId_unique" UNIQUE("national_id")
);
--> statement-breakpoint
ALTER TABLE "Blocks" ADD CONSTRAINT "Blocks_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contests" ADD CONSTRAINT "contests_training_id_block_number_Blocks_training_id_block_number_fk" FOREIGN KEY ("training_id","block_number") REFERENCES "public"."Blocks"("training_id","block_number") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorTraineeHistory" ADD CONSTRAINT "mentorTraineeHistory_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mentorTraineeHistory" ADD CONSTRAINT "mentorTraineeHistory_mentor_id_training_id_staff_user_id_training_id_fk" FOREIGN KEY ("mentor_id","training_id") REFERENCES "public"."staff"("user_id","training_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorTraineeHistory" ADD CONSTRAINT "mentorTraineeHistory_trainee_id_training_id_trainees_user_id_training_id_fk" FOREIGN KEY ("trainee_id","training_id") REFERENCES "public"."trainees"("user_id","training_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trainees" ADD CONSTRAINT "trainees_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trainees" ADD CONSTRAINT "trainees_training_id_trainings_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("training_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trainees" ADD CONSTRAINT "trainees_mentor_id_training_id_staff_user_id_training_id_fk" FOREIGN KEY ("mentor_id","training_id") REFERENCES "public"."staff"("user_id","training_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_head_id_users_user_id_fk" FOREIGN KEY ("head_id") REFERENCES "public"."users"("user_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_chief_judge_users_user_id_fk" FOREIGN KEY ("chief_judge") REFERENCES "public"."users"("user_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "reset_password" ADD CONSTRAINT "reset_password_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_full_data" ADD CONSTRAINT "users_full_data_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_full_data" ADD CONSTRAINT "users_full_data_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_full_data" ADD CONSTRAINT "users_full_data_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_full_data" ADD CONSTRAINT "users_full_data_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_full_data" ADD CONSTRAINT "users_full_data_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_full_data" ADD CONSTRAINT "users_full_data_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_full_data" ADD CONSTRAINT "users_full_data_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");

ALTER SEQUENCE trainings_training_id_seq RESTART WITH 1001;

