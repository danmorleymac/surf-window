import {
    doublePrecision,
    pgTable,
    text,
  } from "drizzle-orm/pg-core";
  
  export const surfSpots = pgTable("surf_spots", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
  });