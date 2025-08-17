ALTER TYPE "public"."borrow_status" ADD VALUE 'Borrowed';
ALTER TYPE "public"."borrow_status" ADD VALUE 'Returned';
ALTER TYPE "public"."borrow_status" ADD VALUE 'Late Return';
ALTER TABLE "borrow_records" ALTER COLUMN "status" SET DEFAULT 'Borrowed';--> statement-breakpoint
UPDATE "borrow_records" SET "status" = 'Borrowed' WHERE "status" = 'BORROWED';