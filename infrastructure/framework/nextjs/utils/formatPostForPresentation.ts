import { I18nLocales } from "@/config/i18n";
import { PostWithLikes } from "@/core/usecases/GetPostUseCase";
import "server-only";

export interface FormattedPostWithLikes extends Omit<PostWithLikes, "date"> {
  date: string; // date is now a formatted string
}

export function formatPostForPresentation(
  post: PostWithLikes,
  locale: I18nLocales,
): FormattedPostWithLikes {
  return {
    ...post,
    date: new Intl.DateTimeFormat(locale).format(new Date(post.date)),
  };
}
