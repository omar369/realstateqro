-- Add columns as nullable first to allow backfill on existing rows
ALTER TABLE "properties" ADD COLUMN "medioBano" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "estado_conservacion" varchar(255);--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "balcon" varchar(255);--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "elevador" varchar(255);--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "bodega" varchar(255);--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "niveles_construidos" varchar(255);--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "estancia_minima_dias" varchar(255);--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "disponibilidad" varchar(255);--> statement-breakpoint

-- Backfill existing rows to satisfy NOT NULL constraints
UPDATE "properties" SET "medioBano" = 0 WHERE "medioBano" IS NULL;--> statement-breakpoint
UPDATE "properties" SET "estado_conservacion" = 'NA' WHERE "estado_conservacion" IS NULL;--> statement-breakpoint
UPDATE "properties" SET "balcon" = 'NA' WHERE "balcon" IS NULL;--> statement-breakpoint
UPDATE "properties" SET "elevador" = 'NA' WHERE "elevador" IS NULL;--> statement-breakpoint
UPDATE "properties" SET "bodega" = 'NA' WHERE "bodega" IS NULL;--> statement-breakpoint
UPDATE "properties" SET "niveles_construidos" = 'NA' WHERE "niveles_construidos" IS NULL;--> statement-breakpoint
UPDATE "properties" SET "estancia_minima_dias" = 'NA' WHERE "estancia_minima_dias" IS NULL;--> statement-breakpoint
UPDATE "properties" SET "disponibilidad" = 'NA' WHERE "disponibilidad" IS NULL;--> statement-breakpoint

-- Enforce NOT NULL constraints after backfill
ALTER TABLE "properties" ALTER COLUMN "medioBano" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "estado_conservacion" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "balcon" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "elevador" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "bodega" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "niveles_construidos" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "estancia_minima_dias" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "disponibilidad" SET NOT NULL;
