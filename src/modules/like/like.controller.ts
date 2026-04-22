import { Controller, Post, Delete, Get, Param, UseGuards, Request, Body } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.likeService.create(createLikeDto, userId);
  }

  @Get('post/:postId')
  findByPost(@Param('postId', ParseMongoIdPipe) postId: string) {
    return this.likeService.findByPost(postId);
  }

  @Get('post/:postId/count')
  countByPost(@Param('postId', ParseMongoIdPipe) postId: string) {
    return this.likeService.countByPost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/liked/:postId')
  userLikedPost(@Param('postId', ParseMongoIdPipe) postId: string, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.likeService.userLikedPost(userId, postId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseMongoIdPipe) userId: string) {
    return this.likeService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.likeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.likeService.remove(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('post/:postId')
  removeByPost(@Param('postId', ParseMongoIdPipe) postId: string, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.likeService.removeByUserAndPost(userId, postId);
  }
}
