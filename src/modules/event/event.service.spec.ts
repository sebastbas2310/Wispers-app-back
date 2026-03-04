import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';

const mockEventModel = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  constructor: jest.fn(),
  save: jest.fn(),
});

describe('EventService', () => {
  let service: EventService;
  let model: Model<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: getModelToken(Event.name), useFactory: mockEventModel },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    model = module.get<Model<Event>>(getModelToken(Event.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
