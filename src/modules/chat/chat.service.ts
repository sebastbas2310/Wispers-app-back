import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const created = new this.chatModel(createChatDto);
    return created.save();
  }

  async findAll(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }

  async findOne(id: string): Promise<Chat> {
    const chat = await this.chatModel.findOne({ id }).exec();
    if (!chat) {
      throw new NotFoundException(`Chat #${id} not found`);
    }
    return chat;
  }

  async update(id: string, updateChatDto: UpdateChatDto): Promise<Chat> {
    const updated = await this.chatModel
      .findOneAndUpdate({ id }, updateChatDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Chat #${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.chatModel.deleteOne({ id }).exec();
    return { deleted: res.deletedCount > 0 };
  }
}
