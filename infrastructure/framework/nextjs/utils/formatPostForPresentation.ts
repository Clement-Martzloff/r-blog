import { I18nLocales } from "@/config/i18n";
import { PostWithLikes } from "@/core/usecases/GetPostUseCase";
import "server-only";

// Define a new type for posts with formatted dates for the presentation layer
export interface FormattedPostWithLikes extends Omit<PostWithLikes, "date"> {
  date: string; // date is now a formatted string
}

/**
 * Formats a PostWithLikes object for the Next.js presentation layer.
 * This includes formatting the date string using the provided locale.
 * @param post The PostWithLikes object from the core domain.
 * @param locale The locale to use for date formatting.
 * @returns A FormattedPostWithLikes object suitable for UI components.
 */
export function formatPostForPresentation(
  post: PostWithLikes,
  locale: I18nLocales,
): FormattedPostWithLikes {
  return {
    ...post,
    date: new Intl.DateTimeFormat(locale).format(new Date(post.date)),
  };
}
