ALTER TABLE "surf_spots"
ADD COLUMN "shore_bearing" integer DEFAULT 0 NOT NULL;

ALTER TABLE "surf_spots"
ALTER COLUMN "shore_bearing" DROP DEFAULT;