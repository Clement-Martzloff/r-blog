import { DomainError, InfraStructureError } from "@/core/domain/errors";
import { IFileWriter } from "@/core/ports/IFileWriter";
import { ILogger } from "@/core/ports/ILogger";
import { IMdastCompiler } from "@/core/ports/IMdastCompiler";
import { IMdastFactory } from "@/core/ports/IMdastFactory";
import {
  IRedditDataFetcher,
  RedditPost,
} from "@/core/ports/IRedditDataFetcher";

export class WritePostFromRedditUseCase {
  constructor(
    private logger: ILogger,
    private redditDataFetcher: IRedditDataFetcher,
    private mdastFactory: IMdastFactory,
    private mdastCompiler: IMdastCompiler,
    private fileWriter: IFileWriter,
  ) {}

  async execute(subreddit: string): Promise<void> {
    try {
      this.logger.info(`Fecthing posts about r/${subreddit}...`);
      const posts = await this.redditDataFetcher.fetchPosts(subreddit);
      this.logger.info("Reddit posts fetched");
      if (posts.length === 0) {
        throw new DomainError(`No posts fetched from r/${subreddit}`);
      }
      this.logger.info("Finding most upvoted title...");
      const mostUpvotedTitle = this.getMostUpvotedTitle(posts);
      this.logger.info("Most upvoted found");
      if (!mostUpvotedTitle) {
        throw new DomainError(
          `Most upvoted post has no valid title in r/${subreddit}`,
        );
      }
      this.logger.info("Creating markdown document...");
      const markdownDocument = await this.mdastFactory.createDocument({
        subreddit,
        mostUpvotedTitle,
        posts,
      });
      this.logger.info("Markdown document created");
      const body = markdownDocument.body;
      if (!body) {
        throw new DomainError("No body found in generated document");
      }
      const metadata = markdownDocument.frontmatter;
      if (!metadata.title) {
        throw new DomainError("No title found in generated metadata");
      }
      this.logger.info("Compiling markdown document...");
      const serializedMarkdown = this.mdastCompiler.compile(markdownDocument);
      this.logger.info("Markdown document compiled");
      this.logger.info("Writing markdown file...");
      await this.fileWriter.write(metadata.title, serializedMarkdown);
      this.logger.info("Markdown file written");
    } catch (error: unknown) {
      if (
        error instanceof DomainError ||
        error instanceof InfraStructureError
      ) {
        throw error;
      }
      throw new DomainError(
        "Unknown error while executing WritePostFromRedditUseCase",
        error,
      );
    }
  }

  private getMostUpvotedTitle(posts: RedditPost[]): string {
    if (posts.length === 0) {
      return "";
    }
    let mostUpvotedPost = posts[0];
    for (let i = 1; i < posts.length; i++) {
      if (posts[i].ups > mostUpvotedPost.ups) {
        mostUpvotedPost = posts[i];
      }
    }
    return mostUpvotedPost.title;
  }
}
