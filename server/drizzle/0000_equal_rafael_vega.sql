CREATE TABLE "trainings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL
);
