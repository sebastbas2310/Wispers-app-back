import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEchoDto } from './dto/create-echo.dto';
import { UpdateEchoDto } from './dto/update-echo.dto';
import { Echo, EchoDocument } from './entities/echo.entity';

@Injectable()
export class EchoService {
  constructor(
    @InjectModel(Echo.name) private echoModel: Model<EchoDocument>,
  ) {}

  async create(createEchoDto: CreateEchoDto): Promise<Echo> {
    // ensure password is provided when privacy is private
    if (createEchoDto.privacy === 'private' && !createEchoDto.password) {
      throw new BadRequestException('Password required for private echo');
    }

    // attach creator to members automatically
    const creator = createEchoDto.echoCreator;
    const existingMembers = Array.isArray(createEchoDto.echoMembers) ? createEchoDto.echoMembers : [];
    const membersSet = new Set(existingMembers);
    if (creator) {
      membersSet.add(creator);
    }

    const createdData = {
      ...createEchoDto,
      echoMembers: Array.from(membersSet),
      echoMessages: Array.isArray(createEchoDto.echoMessages) ? createEchoDto.echoMessages : [],
      echoTags: Array.isArray(createEchoDto.echoTags) ? createEchoDto.echoTags : [],
    };

    const created = new this.echoModel(createdData);
    return created.save();
  }

  async addMember(echoId: string, userId: string): Promise<Echo> {
    const echo = await this.echoModel.findOne({ ID: echoId }).exec();
    if (!echo) {
      throw new NotFoundException(`Echo with ID ${echoId} not found`);
    }
    if (!echo.echoMembers) {
      echo.echoMembers = [];
    }
    if (!echo.echoMembers.includes(userId)) {
      echo.echoMembers.push(userId);
      await echo.save();
    }
    return echo;
  }

  async addMessage(echoId: string, message: string): Promise<Echo> {
    const echo = await this.echoModel.findOne({ ID: echoId }).exec();
    if (!echo) {
      throw new NotFoundException(`Echo with ID ${echoId} not found`);
    }
    if (!echo.echoMessages) {
      echo.echoMessages = [];
    }
    echo.echoMessages.push(message);
    await echo.save();
    return echo;
  }

  async addTag(echoId: string, tag: string): Promise<Echo> {
    const echo = await this.echoModel.findOne({ ID: echoId }).exec();
    if (!echo) {
      throw new NotFoundException(`Echo with ID ${echoId} not found`);
    }
    if (!echo.echoTags) {
      echo.echoTags = [];
    }
    if (!echo.echoTags.includes(tag)) {
      echo.echoTags.push(tag);
      await echo.save();
    }
    return echo;
  }

  async findAll(): Promise<Echo[]> {
    return this.echoModel.find().exec();
  }

  async findOne(id: string): Promise<Echo> {
    const echo = await this.echoModel.findOne({ ID: id }).exec();
    if (!echo) {
      throw new NotFoundException(`Echo with ID ${id} not found`);
    }
    return echo;
  }

  async findByCreator(creatorId: string): Promise<Echo[]> {
    return this.echoModel.find({ echoCreator: creatorId }).exec();
  }

  async update(id: string, updateEchoDto: UpdateEchoDto): Promise<Echo> {
    if (updateEchoDto.privacy === 'private' && !updateEchoDto.password) {
      throw new BadRequestException('Password required for private echo');
    }

    const updated = await this.echoModel
      .findOneAndUpdate({ ID: id }, updateEchoDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Echo with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.echoModel.deleteOne({ ID: id }).exec();
    return { deleted: res.deletedCount > 0 };
  }
}
