CREATE TABLE "email_auth" (
	"token" varchar NOT NULL,
	"user_id" integer PRIMARY KEY NOT NULL,
	"expires_at" date DEFAULT now() + interval '7 day' NOT NULL,
	CONSTRAINT "email_auth_expiresAt_unique" UNIQUE("expires_at")
);
