import { DomainError, InfraStructureError } from "@/core/domain/errors";
import { ILikeRepository } from "@/core/ports/ILikeRepository";
import { IPostRepository } from "@/core/ports/IPostRepository";
import { PostWithLikes } from "@/core/usecases/GetPostUseCase";

export class GetAllPostsUseCase {
  constructor(
    private postRepository: IPostRepository,
    private likeRepository: ILikeRepository,
  ) {}

  async execute(): Promise<PostWithLikes[]> {
    try {
      const posts = await this.postRepository.findAllPosts();
      if (!posts || posts.length === 0) {
        throw new DomainError("No posts found");
      }
      const postsWithLikes = await Promise.all(
        posts.map(async (post) => {
          const likes = await this.likeRepository.getLikesCount(post.slug);
          return {
            ...post,
            likes,
          };
        }),
      );
      postsWithLikes.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      return postsWithLikes;
    } catch (error: unknown) {
      if (
        error instanceof DomainError ||
        error instanceof InfraStructureError
      ) {
        throw error;
      }
      throw new DomainError(
        "Unknown error while executing GetAllPostsUseCase",
        error,
      );
    }
  }
}
