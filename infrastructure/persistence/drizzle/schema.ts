import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const likes = pgTable("likes", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: varchar("post_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
