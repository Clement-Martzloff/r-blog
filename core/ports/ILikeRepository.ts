export interface ILikeRepository {
  getLikesCount(identifier: string): Promise<number>;
  addLike(identifier: string): Promise<void>;
}
