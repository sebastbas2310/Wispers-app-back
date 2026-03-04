import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mensaje, MensajeDocument } from './entities/mensaje.entity';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';

@Injectable()
export class MensajeService {
  constructor(
    @InjectModel(Mensaje.name) private mensajeModel: Model<MensajeDocument>,
  ) {}

  async create(createMensajeDto: CreateMensajeDto): Promise<Mensaje> {
    const created = new this.mensajeModel(createMensajeDto);
    return created.save();
  }

  async findAll(): Promise<Mensaje[]> {
    return this.mensajeModel.find().exec();
  }

  async findOne(id: string): Promise<Mensaje> {
    const msg = await this.mensajeModel.findOne({ id }).exec();
    if (!msg) {
      throw new NotFoundException(`Mensaje #${id} not found`);
    }
    return msg;
  }

  async update(id: string, updateMensajeDto: UpdateMensajeDto): Promise<Mensaje> {
    const updated = await this.mensajeModel
      .findOneAndUpdate({ id }, updateMensajeDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Mensaje #${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.mensajeModel.deleteOne({ id }).exec();
    return { deleted: res.deletedCount > 0 };
  }
}
