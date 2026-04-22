import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.commentService.create(createCommentDto, userId);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get('post/:postId')
  findByPost(@Param('postId', ParseMongoIdPipe) postId: string) {
    return this.commentService.findByPost(postId);
  }

  @Get('post/:postId/count')
  countByPost(@Param('postId', ParseMongoIdPipe) postId: string) {
    return this.commentService.countByPost(postId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseMongoIdPipe) userId: string) {
    return this.commentService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.commentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: any,
  ) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.commentService.update(id, updateCommentDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.commentService.remove(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  addLike(@Param('id', ParseMongoIdPipe) id: string, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.commentService.addLike(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  removeLike(@Param('id', ParseMongoIdPipe) id: string, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.commentService.removeLike(id, userId);
  }

  @Get(':id/like/count')
  countLikes(@Param('id', ParseMongoIdPipe) id: string) {
    return this.commentService.countLikes(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/like/user')
  userLikedComment(@Param('id', ParseMongoIdPipe) id: string, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.commentService.userLikedComment(id, userId);
  }
}
