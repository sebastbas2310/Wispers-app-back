import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MensajeService } from './mensaje.service';
import { Mensaje } from './entities/mensaje.entity';

const mockMensajeModel = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  constructor: jest.fn(),
  save: jest.fn(),
});

describe('MensajeService', () => {
  let service: MensajeService;
  let model: Model<Mensaje>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MensajeService,
        { provide: getModelToken(Mensaje.name), useFactory: mockMensajeModel },
      ],
    }).compile();

    service = module.get<MensajeService>(MensajeService);
    model = module.get<Model<Mensaje>>(getModelToken(Mensaje.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
