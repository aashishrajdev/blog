ALTER TABLE "articles" ADD COLUMN "likes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "likes" integer DEFAULT 0 NOT NULL;