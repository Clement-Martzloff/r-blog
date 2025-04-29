export interface IRedditDataFetcher {
  fetchPosts(subreddit: string): Promise<RedditPost[]>;
}

export interface RedditPost {
  title: string;
  selftext: string;
  ups: number;
  url: string;
}
