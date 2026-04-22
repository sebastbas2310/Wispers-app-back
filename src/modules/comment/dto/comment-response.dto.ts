export class CommentResponseDto {
  id: string;
  message: string;
  userId: string;
  postId: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: Array<{ userId: string; createdAt: Date }>;
  likesCount?: number;
}
