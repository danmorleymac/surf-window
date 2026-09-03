ALTER TABLE "surf_spots"
ADD COLUMN "tidal_station_id" text DEFAULT '' NOT NULL;

ALTER TABLE "surf_spots"
ALTER COLUMN "tidal_station_id" DROP DEFAULT;