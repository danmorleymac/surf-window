import { doublePrecision, pgTable, text } from "drizzle-orm/pg-core";

export const surfSpots = pgTable("surf_spots", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
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
