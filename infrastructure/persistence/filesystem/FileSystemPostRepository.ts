import { InfraStructureError } from "@/core/domain/errors";
import { Post, PostAttributes } from "@/core/domain/post";
import { IPostRepository } from "@/core/ports/IPostRepository";
import frontMatter from "front-matter";
import { promises as fs } from "fs";
import path from "path";

const POSTS_BASE_PATH = path.join(process.cwd(), "content/posts");

export class FileSystemPostRepository implements IPostRepository {
  constructor(private readonly locale: string) {}

  async findPostBySlug(slug: string): Promise<Post> {
    try {
      const filePath = path.join(POSTS_BASE_PATH, this.locale, `${slug}.mdx`);
      return await this.readFileAndParse(filePath);
    } catch (error: unknown) {
      if (error instanceof InfraStructureError) {
        throw error;
      }
      throw new InfraStructureError(
        "Unexpected error occurred while finding post by slug",
        error,
      );
    }
  }

  async findAllPosts(): Promise<Post[]> {
    try {
      const localeDirectoryPath = path.join(POSTS_BASE_PATH, this.locale);
      const slugs = await this.getSlugsFromDirectory(localeDirectoryPath);
      const postsPromises = slugs.map((slug) => this.findPostBySlug(slug));
      return await Promise.all(postsPromises);
    } catch (error: unknown) {
      if (error instanceof InfraStructureError) {
        throw error;
      }
      throw new InfraStructureError(
        "An error occurred while finding all posts",
        error,
      );
    }
  }

  private async getSlugsFromDirectory(
    directoryPath: string,
  ): Promise<string[]> {
    try {
      const filenames = await fs.readdir(directoryPath);
      return filenames
        .filter((filename) => filename.endsWith(".mdx"))
        .map((filename) => {
          const parts = filename.split(".");
          return parts.slice(0, parts.length - 1).join(".");
        });
    } catch (error: unknown) {
      throw new InfraStructureError(
        `An error occurred while reading slugs from ${directoryPath}`,
        error,
      );
    }
  }

  private async readFileAndParse(filePath: string): Promise<Post> {
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { attributes, body } = frontMatter<PostAttributes>(fileContent);
      const dateString = attributes.date || "";
      const slug = path.basename(filePath, ".mdx");
      return {
        ...attributes,
        body,
        date: dateString,
        slug,
      };
    } catch (error: unknown) {
      throw new InfraStructureError(
        `An error occurred while reading or parsing ${filePath}`,
        error,
      );
    }
  }
}
