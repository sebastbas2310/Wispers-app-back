export class CommentResponseDto {
  ID: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: Array<{ userId: string; createdAt: Date }>;
  likesCount?: number;
}
