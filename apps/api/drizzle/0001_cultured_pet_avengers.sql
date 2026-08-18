CREATE TABLE "favourites" (
	"spot_id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "favourites" ADD CONSTRAINT "favourites_spot_id_surf_spots_id_fk" FOREIGN KEY ("spot_id") REFERENCES "public"."surf_spots"("id") ON DELETE cascade ON UPDATE no action;