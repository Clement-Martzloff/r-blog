"use client";

import { FormattedPostWithLikes } from "@/infrastructure/framework/nextjs/utils/formatPostForPresentation";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/src/components/ui/card";
import { useTruncateTitle } from "@/src/hooks/shared/useTruncateTitle";
import { Dictionary } from "@/src/lib/dictionaries";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHeart } from "react-icons/fa";

interface FeaturedBlogPostsProps {
  i18n: Dictionary["translation"]["homePage"];
  posts: FormattedPostWithLikes[];
}

export default function FeaturedBlogPosts({
  posts,
  i18n,
}: FeaturedBlogPostsProps) {
  const truncateTitle = useTruncateTitle();
  const [lang] = usePathname().split("/").filter(Boolean);

  return (
    <section className="container mx-auto space-y-3 px-3 py-6 md:px-6 xl:max-w-5xl">
      <h2 className="text-2xl font-bold md:text-3xl">
        {i18n.featuredPostsTitle} 📣
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: FormattedPostWithLikes) => {
          return (
            <Card key={post.slug}>
              <CardContent className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex text-sm">
                    {post.date}
                  </span>
                  <div className="flex items-center space-x-1">
                    <FaHeart className="text-accent size-3" />
                    <span className="text-accent relative top-[1px] text-sm font-bold">
                      {post.likes}
                    </span>
                  </div>
                </div>
                <Link
                  className="flex underline hover:no-underline"
                  href={`${lang}/${post.slug}`}
                >
                  <CardTitle
                    className="text-xl leading-tight md:text-2xl"
                    title={post.title}
                  >
                    {truncateTitle(post.title, 50)}
                  </CardTitle>
                </Link>
                <span className="flex">
                  {i18n.byText} {post.author}
                </span>
                <div className="flex flex-wrap gap-2 pt-4">
                  {post.tags.map((tag) => (
                    <Badge variant="outline" key={tag}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
