import { Injectable, NotFoundException } from '@nestjs/common';
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
    const created = new this.echoModel(createEchoDto);
    return created.save();
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

  async update(id: string, updateEchoDto: UpdateEchoDto): Promise<Echo> {
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
