import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const created = new this.eventModel(createEventDto);
    return created.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<Event> {
    const ev = await this.eventModel.findOne({ id }).exec();
    if (!ev) {
      throw new NotFoundException(`Event #${id} not found`);
    }
    return ev;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const updated = await this.eventModel
      .findOneAndUpdate({ id }, updateEventDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Event #${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.eventModel.deleteOne({ id }).exec();
    return { deleted: res.deletedCount > 0 };
  }
}
