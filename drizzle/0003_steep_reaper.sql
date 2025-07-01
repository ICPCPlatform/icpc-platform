CREATE VIEW "public"."trainees" AS (
  select "user_id", "training_id", "updated_at" from "applications" where "applications"."status" = 'accepted');