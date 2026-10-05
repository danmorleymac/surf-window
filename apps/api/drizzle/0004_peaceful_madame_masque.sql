ALTER TABLE "surf_spots"
ADD COLUMN "region" text DEFAULT '' NOT NULL;

ALTER TABLE "surf_spots"
ALTER COLUMN "region" DROP DEFAULT;