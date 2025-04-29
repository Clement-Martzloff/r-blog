import { RedditPost } from "@/core/ports/IRedditDataFetcher";
import { RootContent } from "mdast";

export interface IMdastFactory {
  createDocument(context: Context): Promise<MarkdownDocument>;
}

export interface Context {
  subreddit: string;
  mostUpvotedTitle: string;
  posts: RedditPost[];
}

export interface MarkdownDocument {
  frontmatter: Frontmatter;
  body: RootContent[];
}

export interface Frontmatter {
  title: string;
  date: string; // ISO8601
  author: string;
  tags: string[];
}
