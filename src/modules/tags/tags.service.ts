import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const created = new this.tagModel(createTagDto);
    return created.save();
  }

  async findAll(): Promise<Tag[]> {
    return this.tagModel.find().exec();
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagModel.findOne({ ID: id }).exec();
    if (!tag) {
      throw new NotFoundException(`Tag #${id} not found`);
    }
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const updated = await this.tagModel
      .findOneAndUpdate({ ID: id }, updateTagDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Tag #${id} not found`);
    }
    return updated;
  }

  async findByEcho(echoID: string): Promise<Tag[]> {
    return this.tagModel.find({ echoID }).exec();
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.tagModel.deleteOne({ ID: id }).exec();
    return { deleted: res.deletedCount > 0 };
  }
}
