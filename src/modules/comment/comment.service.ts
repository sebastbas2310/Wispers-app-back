import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { PostCommentsResponseDto } from './dto/post-comments-response.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  private mapToResponseDto(comment: Comment): CommentResponseDto {
    return {
      id: comment.id,
      message: comment.message,
      userId: comment.userId,
      postId: comment.postId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      likes: comment.likes,
      likesCount: comment.likes.length,
    };
  }

  async create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const created = new this.commentModel({
      ...createCommentDto,
      userId,
    });
    return created.save();
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByPost(postId: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentModel.find({ postId }).sort({ createdAt: -1 }).exec();
    return comments.map(comment => this.mapToResponseDto(comment));
  }

  async findByPostWithDetails(postId: string): Promise<PostCommentsResponseDto> {
    const comments = await this.commentModel.find({ postId }).sort({ createdAt: -1 }).exec();
    return {
      postId,
      total: comments.length,
      comments: comments.map(comment => this.mapToResponseDto(comment)),
    };
  }

  async findByUser(userId: string): Promise<Comment[]> {
    return this.commentModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel.findOne({ id }).exec();
    if (!comment) {
      throw new NotFoundException(`Comentario #${id} no encontrado`);
    }
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findOne({ id }).exec();
    if (!comment) {
      throw new NotFoundException(`Comentario #${id} no encontrado`);
    }

    if (comment.userId !== userId) {
      throw new BadRequestException('No puedes editar comentarios de otros usuarios');
    }

    const updated = await this.commentModel
      .findOneAndUpdate(
        { id },
        { ...updateCommentDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();
    return updated;
  }

  async remove(id: string, userId: string): Promise<{ deleted: boolean }> {
    const comment = await this.commentModel.findOne({ id }).exec();
    if (!comment) {
      throw new NotFoundException(`Comentario #${id} no encontrado`);
    }

    if (comment.userId !== userId) {
      throw new BadRequestException('No puedes eliminar comentarios de otros usuarios');
    }

    const res = await this.commentModel.deleteOne({ id }).exec();
    return { deleted: res.deletedCount > 0 };
  }

  async addLike(commentId: string, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findOne({ id: commentId }).exec();
    if (!comment) {
      throw new NotFoundException(`Comentario #${commentId} no encontrado`);
    }

    // Verificar si el usuario ya dio like
    const alreadyLiked = comment.likes.some((like) => like.userId === userId);
    if (alreadyLiked) {
      throw new BadRequestException('Ya has dado like a este comentario');
    }

    const updated = await this.commentModel
      .findOneAndUpdate(
        { id: commentId },
        {
          $push: {
            likes: { userId, createdAt: new Date() },
          },
        },
        { new: true },
      )
      .exec();
    return updated;
  }

  async removeLike(commentId: string, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findOne({ id: commentId }).exec();
    if (!comment) {
      throw new NotFoundException(`Comentario #${commentId} no encontrado`);
    }

    const updated = await this.commentModel
      .findOneAndUpdate(
        { id: commentId },
        {
          $pull: {
            likes: { userId },
          },
        },
        { new: true },
      )
      .exec();
    return updated;
  }

  async countLikes(commentId: string): Promise<number> {
    const comment = await this.commentModel.findOne({ id: commentId }).exec();
    if (!comment) {
      throw new NotFoundException(`Comentario #${commentId} no encontrado`);
    }
    return comment.likes.length;
  }

  async userLikedComment(commentId: string, userId: string): Promise<boolean> {
    const comment = await this.commentModel.findOne({ id: commentId }).exec();
    if (!comment) {
      throw new NotFoundException(`Comentario #${commentId} no encontrado`);
    }
    return comment.likes.some((like) => like.userId === userId);
  }

  async countByPost(postId: string): Promise<number> {
    return this.commentModel.countDocuments({ postId }).exec();
  }
}
