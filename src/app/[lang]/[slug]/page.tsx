import { I18nLocales, locales } from "@/config/i18n";
import { getAllPostsServer } from "@/infrastructure/framework/nextjs/server-functions/all-posts";
import { getPostWithLikesServer } from "@/infrastructure/framework/nextjs/server-functions/post";
import { FormattedPostWithLikes } from "@/infrastructure/framework/nextjs/utils/formatPostForPresentation";
import AuthorAvatar from "@/src/app/[lang]/[slug]/components/AuthorAvatar";
import Breadcrumb from "@/src/app/[lang]/[slug]/components/Breadcrumb";
import LikeButton from "@/src/app/[lang]/[slug]/components/LikeButton";
import MDX from "@/src/app/[lang]/[slug]/components/Mdx";
import { Badge } from "@/src/components/ui/badge";
import { getDictionary } from "@/src/lib/dictionaries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale: string) => {
      const posts = await getAllPostsServer(locale as I18nLocales);
      if (posts === null) {
        return notFound();
      }

      return posts.map((post) => ({
        lang: locale,
        slug: post.slug,
      }));
    }),
  );

  return params.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getPostWithLikesServer(slug, lang as I18nLocales);
  if (post === null) {
    return notFound();
  }
  const {
    translation: { postPage },
  } = await getDictionary(lang as I18nLocales);

  if (!post) {
    return {
      title: postPage.notFoundTitle,
    };
  }

  return {
    title: post.title,
    // Optionally add a description using a part of the post body
    // description: post.body.substring(0, 150) + '...',
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const {
    translation: { postPage },
  } = await getDictionary(lang as I18nLocales);
  const post: FormattedPostWithLikes | null = await getPostWithLikesServer(
    slug,
    lang as I18nLocales,
  );

  if (!post) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 md:max-w-2xl md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-3">
          <Breadcrumb postTitle={post.title} />
        </div>
        <div className="md:col-span-3">
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {post.title}
          </h1>
          <section className="mt-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <AuthorAvatar author={post.author} dateString={post.date} />
              </div>
              <div className="flex">
                <LikeButton
                  initialLikes={post.likes}
                  likeLabel={postPage.likeButtonLabel}
                />
              </div>
            </div>
          </section>
          <section className="mt-3">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag: string, index: number) => (
                  <Badge variant="outline" key={index}>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </section>
          <article className="prose prose-neutral lg:prose-lg dark:prose-invert prose-headings:mt-6 prose-headings:mb-4 prose-p:mb-4 prose-a:hover:no-underline prose-a:text-primary py-6">
            <MDX source={post.body}></MDX>
          </article>
        </div>
      </div>
    </main>
  );
}
