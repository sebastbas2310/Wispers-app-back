import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EchoService } from './echo.service';
import { Echo } from './entities/echo.entity';

const mockEchoModel = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  constructor: jest.fn(),
  save: jest.fn(),
});

describe('EchoService', () => {
  let service: EchoService;
  let model: Model<Echo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EchoService,
        { provide: getModelToken(Echo.name), useFactory: mockEchoModel },
      ],
    }).compile();

    service = module.get<EchoService>(EchoService);
    model = module.get<Model<Echo>>(getModelToken(Echo.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
