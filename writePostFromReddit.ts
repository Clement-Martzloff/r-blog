import { DomainError, InfraStructureError } from "@/core/domain/errors";
import { WritePostFromRedditUseCase } from "@/core/usecases/WritePostFromRedditUseCase";
import { ConsoleLogger } from "@/infrastructure/adapters/ConsoleLogger";
import { MistralApiMdastFactory } from "@/infrastructure/adapters/MistralApiMdastFactory";
import { RedditApiDataFetcher } from "@/infrastructure/adapters/RedditApiDataFetcher";
import { RemarkMdastCompiler } from "@/infrastructure/adapters/RemarkMdastCompiler";
import { FileSystemFileWriter } from "@/infrastructure/persistence/filesystem/FileSystemWriter";
import { config } from "dotenv";

config();

const LLM_API_KEY = process.env.LLM_API_KEY;
if (!LLM_API_KEY) {
  throw new InfraStructureError(
    "Missing environment keys while executing WritePostFromRedditUseCase",
  );
}
const TARGET_SUBREDDIT = "learnprogramming";
const consoleLogger = new ConsoleLogger();
const writePostFromRedditUseCase = new WritePostFromRedditUseCase(
  consoleLogger,
  new RedditApiDataFetcher(),
  new MistralApiMdastFactory(LLM_API_KEY),
  new RemarkMdastCompiler(),
  new FileSystemFileWriter(),
);

main();

async function main() {
  try {
    await writePostFromRedditUseCase.execute(TARGET_SUBREDDIT);
  } catch (error: unknown) {
    if (error instanceof InfraStructureError) {
      consoleLogger.error(
        `Infrastructure error while executing writePostFromReddit: ${error.message}`,
        error,
      );
    }
    if (error instanceof DomainError) {
      consoleLogger.error(
        `Domain error while executing writePostFromReddit: ${error.message}`,
        error,
      );
    }
    consoleLogger.error(
      "An unknown error occurred while executing writePostFromReddit",
      error,
    );
  }
}
