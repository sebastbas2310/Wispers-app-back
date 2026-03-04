import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';

const mockTagModel = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  constructor: jest.fn(),
  save: jest.fn(),
});

describe('TagsService', () => {
  let service: TagsService;
  let model: Model<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: getModelToken(Tag.name), useFactory: mockTagModel },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    model = module.get<Model<Tag>>(getModelToken(Tag.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
