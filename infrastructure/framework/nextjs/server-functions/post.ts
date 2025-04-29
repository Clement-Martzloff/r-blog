import { I18nLocales } from "@/config/i18n";
import { GetPostUseCase } from "@/core/usecases/GetPostUseCase";
import {
  FormattedPostWithLikes,
  formatPostForPresentation,
} from "@/infrastructure/framework/nextjs/utils/formatPostForPresentation";
import { DrizzleLikeRepository } from "@/infrastructure/persistence/drizzle/DrizzleLikeRepository";
import { FileSystemPostRepository } from "@/infrastructure/persistence/filesystem/FileSystemPostRepository";
import "server-only";

const drizzleLikeRepository = new DrizzleLikeRepository();

export async function getPostWithLikesServer(
  slug: string,
  locale: I18nLocales,
): Promise<FormattedPostWithLikes | null> {
  const fileSystemPostRepository = new FileSystemPostRepository(locale);
  const getPostUseCase = new GetPostUseCase(
    fileSystemPostRepository,
    drizzleLikeRepository,
  );
  try {
    const post = await getPostUseCase.execute(slug);
    return formatPostForPresentation(post, locale);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return null;
  }
}
