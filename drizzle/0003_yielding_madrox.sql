ALTER TABLE "articles" ADD COLUMN "category_ids" text;--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN IF EXISTS "category_id";