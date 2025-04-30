import { I18nLocales } from "@/config/i18n";
import { getAllPostsServer } from "@/infrastructure/framework/nextjs/server-functions/all-posts";
import FeaturedBlogPosts from "@/src/app/[lang]/components/FeaturedBlogPosts";
import HeroSection from "@/src/app/[lang]/components/HeroSection";
import { getDictionary } from "@/src/lib/dictionaries";
import { notFound } from "next/navigation";

export const revalidate = 10;

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const posts = await getAllPostsServer(lang as I18nLocales);
  if (posts === null) {
    return notFound();
  }
  const featuredPosts = posts.filter((post) => post.type !== "static");

  return (
    <main className="flex flex-col">
      <HeroSection
        i18n={{
          ...dictionary.translation.homePage,
          ...dictionary.translation.paths,
        }}
      />
      <FeaturedBlogPosts
        posts={featuredPosts}
        i18n={{ ...dictionary.translation.homePage }}
      />
    </main>
  );
}
