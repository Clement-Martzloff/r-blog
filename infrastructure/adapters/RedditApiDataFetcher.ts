import { InfraStructureError } from "@/core/domain/errors";
import {
  IRedditDataFetcher,
  RedditPost,
} from "@/core/ports/IRedditDataFetcher";

export class RedditApiDataFetcher implements IRedditDataFetcher {
  async fetchPosts(subreddit: string): Promise<RedditPost[]> {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/new.json?limit=5`,
      );
      if (!response.ok) {
        throw new InfraStructureError(
          [
            `Failed to fetch Reddit data: ${response.statusText}`,
            `subreddit: ${subreddit}`,
            `response status: ${response.status}`,
          ].join(" "),
        );
      }
      const data = await response.json();
      if (
        !data.data ||
        !data.data.children ||
        data.data.children.length === 0
      ) {
        throw new InfraStructureError(
          `No posts found for subreddit: ${subreddit}`,
        );
      }
      return data.data.children.map(
        (child: { data: RedditPost }) => child.data,
      );
    } catch (error: unknown) {
      if (error instanceof InfraStructureError) {
        throw error;
      }
      throw new InfraStructureError(
        "An error occurred while fetching Reddit data",
      );
    }
  }
}
