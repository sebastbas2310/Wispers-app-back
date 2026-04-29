import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, LikeDocument } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) {}

  async create(createLikeDto: CreateLikeDto, userId: string): Promise<{ action: 'liked' | 'unliked'; like?: Like }> {
    // Verificar si el usuario ya dio like a este post
    const existingLike = await this.likeModel
      .findOne({
        userId,
        postId: createLikeDto.postId,
      })
      .exec();

    // Si ya existe un like, eliminarlo (toggle)
    if (existingLike) {
      await this.likeModel.deleteOne({ _id: existingLike._id }).exec();
      return { action: 'unliked' };
    }

    // Si no existe, crear el like
    const created = new this.likeModel({
      userId,
      postId: createLikeDto.postId,
    });
    const savedLike = await created.save();
    return { action: 'liked', like: savedLike };
  }

  async findByPost(postId: string): Promise<Like[]> {
    return this.likeModel.find({ postId }).exec();
  }

  async findByUser(userId: string): Promise<Like[]> {
    return this.likeModel.find({ userId }).exec();
  }

  async findOne(id: string): Promise<Like> {
    const like = await this.likeModel.findOne({ id }).exec();
    if (!like) {
      throw new NotFoundException(`Like #${id} not found`);
    }
    return like;
  }

  async remove(id: string, userId: string): Promise<{ deleted: boolean }> {
    const like = await this.likeModel.findOne({ id }).exec();
    if (!like) {
      throw new NotFoundException(`Like #${id} not found`);
    }

    if (like.userId !== userId) {
      throw new BadRequestException('No puedes eliminar likes de otros usuarios');
    }

    const res = await this.likeModel.deleteOne({ id }).exec();
    return { deleted: res.deletedCount > 0 };
  }

  async removeByUserAndPost(userId: string, postId: string): Promise<{ deleted: boolean }> {
    const res = await this.likeModel
      .deleteOne({ userId, postId })
      .exec();
    return { deleted: res.deletedCount > 0 };
  }

  async countByPost(postId: string): Promise<number> {
    return this.likeModel.countDocuments({ postId }).exec();
  }

  async userLikedPost(userId: string, postId: string): Promise<boolean> {
    const like = await this.likeModel
      .findOne({ userId, postId })
      .exec();
    return !!like;
  }
}
