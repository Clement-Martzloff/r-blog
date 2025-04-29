import { InfraStructureError } from "@/core/domain/errors";
import { ILikeRepository } from "@/core/ports/ILikeRepository";
import { client } from "@/infrastructure/persistence/drizzle/client";
import { likes } from "@/infrastructure/persistence/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export class DrizzleLikeRepository implements ILikeRepository {
  async getLikesCount(postId: string): Promise<number> {
    try {
      const count = await client
        .select({ count: sql<number>`count(*)` })
        .from(likes)
        .where(eq(likes.postId, postId));
      return Number(count[0]?.count) || 0;
    } catch (error: unknown) {
      throw new InfraStructureError(
        `An error occurred while getting likes count for post of id: ${postId}`,
        error,
      );
    }
  }

  async addLike(postId: string): Promise<void> {
    try {
      await client.insert(likes).values({ postId });
    } catch (error: unknown) {
      throw new InfraStructureError(
        `An error occurred while liking post of id: ${postId}`,
        error,
      );
    }
  }
}
