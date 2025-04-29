import { DomainError, InfraStructureError } from "@/core/domain/errors";
import { Post } from "@/core/domain/post";
import { ILikeRepository } from "@/core/ports/ILikeRepository";
import { IPostRepository } from "@/core/ports/IPostRepository";

export interface PostWithLikes extends Post {
  likes: number;
}

export class GetPostUseCase {
  constructor(
    private postRepository: IPostRepository,
    private likeRepository: ILikeRepository,
  ) {}

  async execute(slug: string): Promise<PostWithLikes> {
    try {
      const post = await this.postRepository.findPostBySlug(slug);
      const likes = await this.likeRepository.getLikesCount(slug);
      return { ...post, likes };
    } catch (error: unknown) {
      if (error instanceof InfraStructureError) {
        throw error;
      }
      throw new DomainError(
        "Unknown error while executing GetPostUseCase",
        error,
      );
    }
  }
}
