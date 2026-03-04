import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Votacion, VotacionDocument } from './entities/votacion.entity';
import { CreateVotacionDto } from './dto/create-votacion.dto';
import { UpdateVotacionDto } from './dto/update-votacion.dto';

@Injectable()
export class VotacionService {
  constructor(
    @InjectModel(Votacion.name) private votacionModel: Model<VotacionDocument>,
  ) {}

  async create(createVotacionDto: CreateVotacionDto): Promise<Votacion> {
    const created = new this.votacionModel(createVotacionDto);
    return created.save();
  }

  async findAll(): Promise<Votacion[]> {
    return this.votacionModel.find().exec();
  }

  async findOne(id: string): Promise<Votacion> {
    const vot = await this.votacionModel.findOne({ id }).exec();
    if (!vot) {
      throw new NotFoundException(`Votacion #${id} not found`);
    }
    return vot;
  }

  async update(id: string, updateVotacionDto: UpdateVotacionDto): Promise<Votacion> {
    const updated = await this.votacionModel
      .findOneAndUpdate({ id }, updateVotacionDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Votacion #${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.votacionModel.deleteOne({ id }).exec();
    return { deleted: res.deletedCount > 0 };
  }
}
