ALTER TABLE "blocks" ADD COLUMN "material" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "trainings" DROP COLUMN "material";