import { CommentResponseDto } from './comment-response.dto';

export class PostCommentsResponseDto {
  postId: string;
  total: number;
  comments: CommentResponseDto[];
}
