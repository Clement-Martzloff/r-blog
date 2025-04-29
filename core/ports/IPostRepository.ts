import { Post } from "@/core/domain/post";

export interface IPostRepository {
  findPostBySlug(slug: string): Promise<Post>;
  findAllPosts(): Promise<Post[]>;
}
