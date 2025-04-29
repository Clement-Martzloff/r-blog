import { DomainError, InfraStructureError } from "@/core/domain/errors";
import { ILikeRepository } from "@/core/ports/ILikeRepository";

export class LikePostUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async execute(postId: string): Promise<void> {
    try {
      await this.likeRepository.addLike(postId);
    } catch (error: unknown) {
      if (error instanceof InfraStructureError) {
        throw error;
      }
      throw new DomainError(
        "Unknown error while executing LikePostUseCase",
        error,
      );
    }
  }
}
