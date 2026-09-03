import { doublePrecision, integer, pgTable, text } from "drizzle-orm/pg-core";

export const surfSpots = pgTable("surf_spots", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  // Approximate bearing from the shore towards the sea, in degrees.
  shoreBearing: integer("shore_bearing").notNull(),
  // UKHO tidal station used as the reference for this surf spot.
  tidalStationId: text("tidal_station_id").notNull(),
});

export const favourites = pgTable("favourites", {
  spotId: text("spot_id")
    .primaryKey()
    .references(() => surfSpots.id, {
      onDelete: "cascade",
    }),
});

export type SurfSpot = typeof surfSpots.$inferSelect;
export type Favourite = typeof favourites.$inferSelect;
