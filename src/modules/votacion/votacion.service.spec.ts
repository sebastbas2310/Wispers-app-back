import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VotacionService } from './votacion.service';
import { Votacion } from './entities/votacion.entity';

const mockVotacionModel = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  constructor: jest.fn(),
  save: jest.fn(),
});

describe('VotacionService', () => {
  let service: VotacionService;
  let model: Model<Votacion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotacionService,
        { provide: getModelToken(Votacion.name), useFactory: mockVotacionModel },
      ],
    }).compile();

    service = module.get<VotacionService>(VotacionService);
    model = module.get<Model<Votacion>>(getModelToken(Votacion.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
