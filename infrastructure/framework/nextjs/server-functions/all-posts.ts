import { I18nLocales } from "@/config/i18n";

import { GetAllPostsUseCase } from "@/core/usecases/GetAllPostsUseCase";

import {
  FormattedPostWithLikes,
  formatPostForPresentation,
} from "@/infrastructure/framework/nextjs/utils/formatPostForPresentation";
import { DrizzleLikeRepository } from "@/infrastructure/persistence/drizzle/DrizzleLikeRepository";
import { FileSystemPostRepository } from "@/infrastructure/persistence/filesystem/FileSystemPostRepository";
import "server-only";

const drizzleLikeRepository = new DrizzleLikeRepository();

export async function getAllPostsServer(
  locale: I18nLocales,
): Promise<FormattedPostWithLikes[] | null> {
  const fileSystemPostRepository = new FileSystemPostRepository(locale);
  const getAllPostsUseCase = new GetAllPostsUseCase(
    fileSystemPostRepository,
    drizzleLikeRepository,
  );
  try {
    const postsWithLikes = await getAllPostsUseCase.execute();
    const formattedPosts = postsWithLikes.map((post) =>
      formatPostForPresentation(post, locale),
    );
    return formattedPosts;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return null;
  }
}
