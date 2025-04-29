import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const likes = pgTable("likes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	postId: varchar("post_id", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
